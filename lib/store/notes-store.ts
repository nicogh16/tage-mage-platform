import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import { SectionId, NoteCategoryId } from '@/lib/constants';

export interface Note {
  id: string;
  user_id: string;
  section: SectionId;
  title: string;
  content: string;
  category: NoteCategoryId;
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface NotesState {
  notes: Note[];
  loading: boolean;
  fetchNotes: (section?: SectionId) => Promise<void>;
  addNote: (
    section: SectionId,
    title: string,
    content: string,
    category: NoteCategoryId,
    tags: string[]
  ) => Promise<void>;
  updateNote: (
    id: string,
    title: string,
    content: string,
    category: NoteCategoryId,
    tags: string[]
  ) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  getNotesBySection: (section: SectionId) => Note[];
  searchNotes: (query: string, section?: SectionId) => Note[];
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  loading: false,
  fetchNotes: async (section) => {
    set({ loading: true });
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      set({ loading: false });
      return;
    }

    let query = supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (section) {
      query = query.eq('section', section);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching notes:', error);
      set({ loading: false });
      return;
    }

    set({ notes: data || [], loading: false });
  },
  addNote: async (section, title, content, category, tags) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    const { data, error } = await supabase
      .from('notes')
      .insert({
        user_id: user.id,
        section,
        title,
        content,
        category,
        tags,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding note:', error);
      return;
    }

    set((state) => ({
      notes: [data, ...state.notes],
    }));
  },
  updateNote: async (id, title, content, category, tags) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('notes')
      .update({
        title,
        content,
        category,
        tags,
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating note:', error);
      return;
    }

    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === id
          ? { ...n, title, content, category, tags, updated_at: new Date().toISOString() }
          : n
      ),
    }));
  },
  deleteNote: async (id) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting note:', error);
      return;
    }

    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
    }));
  },
  getNotesBySection: (section) => {
    return get().notes.filter((n) => n.section === section);
  },
  searchNotes: (query, section) => {
    const lowerQuery = query.toLowerCase();
    let notes = get().notes;

    if (section) {
      notes = notes.filter((n) => n.section === section);
    }

    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(lowerQuery) ||
        n.content.toLowerCase().includes(lowerQuery) ||
        n.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  },
}));

