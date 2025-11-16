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
}

interface ScoresState {
  scores: Score[];
  loading: boolean;
  fetchScores: () => Promise<void>;
  addScore: (section: SectionId, score: number, date?: Date) => Promise<void>;
  deleteScore: (id: string) => Promise<void>;
  getScoresBySection: (section: SectionId) => Score[];
  getAverageBySection: (section: SectionId) => number;
  getGlobalAverage: () => number;
  getBestSection: () => SectionId | null;
  getWorstSection: () => SectionId | null;
  getAverageByGroup: (groupId: keyof typeof GROUPS) => number;
  getTageMageScore: () => number; // Final score /600
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
  addScore: async (section, score, date = new Date()) => {
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
    // Calculate average of 3 groups, then multiply by 10 to get score out of 600
    // Each group is out of 30 (2 sections × 15)
    const group1Avg = get().getAverageByGroup('groupe1');
    const group2Avg = get().getAverageByGroup('groupe2');
    const group3Avg = get().getAverageByGroup('groupe3');
    
    const validGroups = [group1Avg, group2Avg, group3Avg].filter((avg) => avg > 0);
    if (validGroups.length === 0) return 0;
    
    // Average of groups (out of 30), then multiply by 10
    const averageOfGroups = validGroups.reduce((sum, avg) => sum + avg, 0) / validGroups.length;
    return Math.round(averageOfGroups * 10 * 10) / 10;
  },
}));

