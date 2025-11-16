'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { useNotesStore } from '@/lib/store/notes-store';
import { useAuthStore } from '@/lib/store/auth-store';
import { SECTIONS, SECTION_IDS, NOTE_CATEGORIES, NoteCategoryId } from '@/lib/constants';
import { formatDateTime } from '@/lib/utils';
import { Plus, Search, Edit2, Trash2, X, Tag } from 'lucide-react';

export default function NotesPage() {
  const params = useParams();
  const router = useRouter();
  const section = (params.section as any) || SECTION_IDS[0];
  
  const { notes, loading, fetchNotes, addNote, updateNote, deleteNote, searchNotes } = useNotesStore();
  const { user } = useAuthStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'personal_notes' as NoteCategoryId,
    tags: '',
  });

  useEffect(() => {
    if (user) {
      fetchNotes(section);
    }
  }, [user, section, fetchNotes]);

  const sectionNotes = searchQuery
    ? searchNotes(searchQuery, section)
    : notes.filter((n) => n.section === section);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = formData.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    if (editingId) {
      await updateNote(
        editingId,
        formData.title,
        formData.content,
        formData.category,
        tagsArray
      );
      setEditingId(null);
    } else {
      await addNote(
        section,
        formData.title,
        formData.content,
        formData.category,
        tagsArray
      );
      setIsAdding(false);
    }

    setFormData({
      title: '',
      content: '',
      category: 'personal_notes',
      tags: '',
    });
  };

  const handleEdit = (note: any) => {
    setEditingId(note.id);
    setFormData({
      title: note.title,
      content: note.content,
      category: note.category,
      tags: note.tags.join(', '),
    });
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      title: '',
      content: '',
      category: 'personal_notes',
      tags: '',
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      await deleteNote(id);
    }
  };

  const sectionData = SECTIONS[section];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Notes - {sectionData.name}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gérez vos notes de révision pour cette section
          </p>
        </div>

        {/* Section Selector */}
        <div className="mb-6">
          <Select
            value={section}
            onChange={(e) => router.push(`/notes/${e.target.value}`)}
            className="w-full md:w-auto"
          >
            {SECTION_IDS.map((sectionId) => (
              <option key={sectionId} value={sectionId}>
                {SECTIONS[sectionId].name}
              </option>
            ))}
          </Select>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher dans les notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Add Note Button */}
        {!isAdding && (
          <div className="mb-6">
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une Note
            </Button>
          </div>
        )}

        {/* Add/Edit Form */}
        {isAdding && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {editingId ? 'Modifier la Note' : 'Nouvelle Note'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Titre</label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    placeholder="Titre de la note"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Catégorie</label>
                  <Select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as NoteCategoryId,
                      })
                    }
                    required
                  >
                    {Object.values(NOTE_CATEGORIES).map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contenu</label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    required
                    rows={6}
                    placeholder="Contenu de la note..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tags (séparés par des virgules)
                  </label>
                  <Input
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    placeholder="tag1, tag2, tag3"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="submit">
                    {editingId ? 'Modifier' : 'Ajouter'}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Notes List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement...</p>
          </div>
        ) : sectionNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sectionNotes.map((note) => {
              const category = NOTE_CATEGORIES[note.category];
              return (
                <Card key={note.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{note.title}</CardTitle>
                        <CardDescription>
                          <span className="inline-flex items-center">
                            {category.icon} {category.name}
                          </span>
                        </CardDescription>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(note)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(note.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-4">
                      {note.content}
                    </p>
                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {note.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs"
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDateTime(note.updated_at)}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery
                  ? 'Aucune note ne correspond à votre recherche'
                  : 'Aucune note pour cette section'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

