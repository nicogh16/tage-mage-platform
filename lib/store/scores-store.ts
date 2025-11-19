import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import { SectionId, SECTION_IDS, GROUPS, MAX_SCORE_PER_SECTION, MAX_SCORE_TAGE_MAGE } from '@/lib/constants';

export interface Score {
  id: string;
  user_id: string;
  section: SectionId;
  score: number;
  date: string;
  created_at: string;
  test_name?: string | null; // Name of the test (e.g., 'test-1', 'test-2')
}

interface ScoresState {
  scores: Score[];
  loading: boolean;
  fetchScores: () => Promise<void>;
  addScore: (section: SectionId, score: number, date?: Date, testName?: string) => Promise<void>;
  deleteScore: (id: string) => Promise<void>;
  getScoresBySection: (section: SectionId) => Score[];
  getScoresByTest: (testName: string) => Score[];
  getTestsList: () => string[]; // Get list of all test names
  getTestTotalScore: (testName: string) => number; // Total score for a test (sum of all sections)
  getAverageBySection: (section: SectionId) => number;
  getGlobalAverage: () => number;
  getBestSection: () => SectionId | null;
  getWorstSection: () => SectionId | null;
  getAverageByGroup: (groupId: keyof typeof GROUPS) => number;
  getTageMageScore: () => number; // Final score /600
  getCompleteTestsTageMageScores: () => number[]; // Array of Tage Mage scores for complete tests
  getAverageTageMageFromCompleteTests: () => number; // Average of complete tests
  getMinMaxTageMageFromCompleteTests: () => { min: number; max: number } | null; // Min and max from complete tests
  getSectionStatsFromCompleteTests: (section: SectionId) => { average: number; min: number; max: number }; // Stats per section from complete tests
}

export const useScoresStore = create<ScoresState>((set, get) => ({
  scores: [],
  loading: false,
  fetchScores: async () => {
    set({ loading: true });
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      set({ loading: false });
      return;
    }

    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching scores:', error);
      set({ loading: false });
      return;
    }

    set({ scores: data || [], loading: false });
  },
  addScore: async (section, score, date = new Date(), testName?: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    const { data, error } = await supabase
      .from('scores')
      .insert({
        user_id: user.id,
        section,
        score,
        date: date.toISOString(),
        test_name: testName || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding score:', error);
      return;
    }

    set((state) => ({
      scores: [data, ...state.scores],
    }));
  },
  deleteScore: async (id) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('scores')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting score:', error);
      return;
    }

    set((state) => ({
      scores: state.scores.filter((s) => s.id !== id),
    }));
  },
  getScoresBySection: (section) => {
    return get().scores.filter((s) => s.section === section);
  },
  getScoresByTest: (testName) => {
    // Get all scores for this test, but if there are duplicates (same section),
    // keep only the most recent one (by date)
    const allScores = get().scores.filter((s) => s.test_name === testName);
    const scoresBySection = new Map<string, typeof allScores[0]>();
    
    // Keep only the most recent score for each section
    allScores.forEach((score) => {
      const existing = scoresBySection.get(score.section);
      if (!existing || new Date(score.date) > new Date(existing.date)) {
        scoresBySection.set(score.section, score);
      }
    });
    
    return Array.from(scoresBySection.values());
  },
  getTestsList: () => {
    const tests = new Set<string>();
    get().scores.forEach((s) => {
      if (s.test_name) {
        tests.add(s.test_name);
      }
    });
    return Array.from(tests).sort((a, b) => {
      // Sort test-1, test-2, etc. numerically
      const numA = parseInt(a.replace('test-', '')) || 0;
      const numB = parseInt(b.replace('test-', '')) || 0;
      return numA - numB;
    });
  },
  getTestTotalScore: (testName) => {
    const testScores = get().getScoresByTest(testName);
    if (testScores.length === 0) return 0;
    // Sum all scores for this test (should be 6 sections × 15 = 90 max)
    return testScores.reduce((sum, s) => sum + s.score, 0);
  },
  getAverageBySection: (section) => {
    const sectionScores = get().getScoresBySection(section);
    if (sectionScores.length === 0) return 0;
    const sum = sectionScores.reduce((acc, s) => acc + s.score, 0);
    return Math.round((sum / sectionScores.length) * 10) / 10;
  },
  getGlobalAverage: () => {
    const scores = get().scores;
    if (scores.length === 0) return 0;
    const sum = scores.reduce((acc, s) => acc + s.score, 0);
    return Math.round((sum / scores.length) * 10) / 10;
  },
  getBestSection: () => {
    const averages = SECTION_IDS.map((section) => ({
      section,
      avg: get().getAverageBySection(section),
    }));
    const validAverages = averages.filter((a) => a.avg > 0);
    if (validAverages.length === 0) return null;
    return validAverages.reduce((best, current) =>
      current.avg > best.avg ? current : best
    ).section;
  },
  getWorstSection: () => {
    const averages = SECTION_IDS.map((section) => ({
      section,
      avg: get().getAverageBySection(section),
    }));
    const validAverages = averages.filter((a) => a.avg > 0);
    if (validAverages.length === 0) return null;
    return validAverages.reduce((worst, current) =>
      current.avg < worst.avg ? current : worst
    ).section;
  },
  getAverageByGroup: (groupId) => {
    const group = GROUPS[groupId];
    const section1Avg = get().getAverageBySection(group.sections[0]);
    const section2Avg = get().getAverageBySection(group.sections[1]);
    
    // Group score is the sum of the two sections (out of 30)
    // Both sections must have scores to calculate group average
    if (section1Avg > 0 && section2Avg > 0) {
      return Math.round((section1Avg + section2Avg) * 10) / 10;
    }
    return 0;
  },
  getTageMageScore: () => {
    // Calculate average of 3 groups, then multiply by 2 × 10 = 20 to get score out of 600
    // Each group is out of 30 (2 sections × 15)
    // Formula: (average of 3 groups) × 2 × 10 = average × 20
    const group1Avg = get().getAverageByGroup('groupe1');
    const group2Avg = get().getAverageByGroup('groupe2');
    const group3Avg = get().getAverageByGroup('groupe3');
    
    const validGroups = [group1Avg, group2Avg, group3Avg].filter((avg) => avg > 0);
    if (validGroups.length === 0) return 0;
    
    // Average of groups (out of 30), then multiply by 2 × 10 = 20
    const averageOfGroups = validGroups.reduce((sum, avg) => sum + avg, 0) / validGroups.length;
    return Math.round(averageOfGroups * 2 * 10 * 10) / 10;
  },
  getCompleteTestsTageMageScores: () => {
    const testsList = get().getTestsList();
    const scores: number[] = [];
    
    testsList.forEach((testName) => {
      const testScores = get().getScoresByTest(testName);
      // A test is complete if it has all 6 sections
      if (testScores.length === 6) {
        // Groupe 1: calcul_mental + conditions_minimales
        const group1 = (testScores.find(s => s.section === 'calcul_mental')?.score || 0) +
                     (testScores.find(s => s.section === 'conditions_minimales')?.score || 0);
        // Groupe 2: comprehension_textes + expression
        const group2 = (testScores.find(s => s.section === 'comprehension_textes')?.score || 0) +
                     (testScores.find(s => s.section === 'expression')?.score || 0);
        // Groupe 3: raisonnement_logique + resolution_problemes
        const group3 = (testScores.find(s => s.section === 'raisonnement_logique')?.score || 0) +
                     (testScores.find(s => s.section === 'resolution_problemes')?.score || 0);
        const avgGroups = (group1 + group2 + group3) / 3;
        // Formula: average × 2 × 10 = average × 20
        const tageMageScore = Math.round(avgGroups * 2 * 10);
        scores.push(tageMageScore);
      }
    });
    
    return scores;
  },
  getAverageTageMageFromCompleteTests: () => {
    const scores = get().getCompleteTestsTageMageScores();
    if (scores.length === 0) return 0;
    const sum = scores.reduce((acc, s) => acc + s, 0);
    return Math.round((sum / scores.length) * 10) / 10;
  },
  getMinMaxTageMageFromCompleteTests: () => {
    const scores = get().getCompleteTestsTageMageScores();
    if (scores.length === 0) return null;
    return {
      min: Math.min(...scores),
      max: Math.max(...scores),
    };
  },
  getSectionStatsFromCompleteTests: (section) => {
    const testsList = get().getTestsList();
    const sectionScores: number[] = [];
    
    testsList.forEach((testName) => {
      const testScores = get().getScoresByTest(testName);
      if (testScores.length === 6) {
        const sectionScore = testScores.find(s => s.section === section);
        if (sectionScore) {
          sectionScores.push(sectionScore.score);
        }
      }
    });
    
    if (sectionScores.length === 0) {
      return { average: 0, min: 0, max: 0 };
    }
    
    const sum = sectionScores.reduce((acc, s) => acc + s, 0);
    const average = Math.round((sum / sectionScores.length) * 10) / 10;
    const min = Math.min(...sectionScores);
    const max = Math.max(...sectionScores);
    
    return { average, min, max };
  },
}));

