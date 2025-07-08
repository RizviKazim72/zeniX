'use client';

import { useState, useEffect } from 'react';
import { 
  Mail, 
  Calendar,
  Edit,
  Save,
  X,
  Shield
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import UserAvatar from '@/components/ui/UserAvatar';
import ProfileImageUploader from '@/components/ui/ProfileImageUploader';
import NavBar from '@/components/common/NavBar';
import Footer from '@/components/common/Footer';

export default function ProfilePage() {
  const { user, isAuthenticated, loading, updateProfile } = useAuth();
  const { success, error: showError } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    country: '',
    dateOfBirth: '',
    preferredLanguage: 'en',
    favoriteGenres: [] as string[],
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = '/login';
    }
  }, [isAuthenticated, loading]);

  useEffect(() => {
    if (user) {
      // Format dateOfBirth for input[type="date"] (YYYY-MM-DD format)
      let formattedDate = '';
      if (user.dateOfBirth) {
        try {
          const date = new Date(user.dateOfBirth);
          if (!isNaN(date.getTime())) {
            formattedDate = date.toISOString().split('T')[0];
          }
        } catch (error) {
          console.error('Error formatting date:', error);
        }
      }

      console.log('User data:', user); // Debug log
      console.log('Formatted date:', formattedDate); // Debug log

      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
        country: user.country || '',
        dateOfBirth: formattedDate,
        preferredLanguage: user.preferences?.preferredLanguage || 'en',
        favoriteGenres: user.preferences?.favoriteGenres || [],
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenreToggle = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      favoriteGenres: prev.favoriteGenres.includes(genre)
        ? prev.favoriteGenres.filter(g => g !== genre)
        : [...prev.favoriteGenres, genre]
    }));
  };

  const handleProfileImageChange = (file: File | null, preview: string | null) => {
    setProfileImageFile(file);
    setProfileImagePreview(preview);
  };

  const handleSave = async () => {
    // Validate required fields
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      showError('First name and last name are required');
      return;
    }

    if (formData.firstName.length < 2 || formData.lastName.length < 2) {
      showError('Names must be at least 2 characters long');
      return;
    }

    // Validate name format
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(formData.firstName) || !nameRegex.test(formData.lastName)) {
      showError('Names can only contain letters and spaces');
      return;
    }

    setIsSaving(true);

    try {
      // Prepare update payload
      const updatePayload: Record<string, unknown> = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
      };

      // Add optional fields if they have values
      if (formData.bio.trim()) {
        updatePayload.bio = formData.bio.trim();
      }

      if (formData.country.trim()) {
        updatePayload.country = formData.country.trim();
      }

      if (formData.dateOfBirth) {
        updatePayload.dateOfBirth = formData.dateOfBirth;
      }

      // Handle profile image upload
      if (profileImageFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('profileImage', profileImageFile);
        
        try {
          const imageResponse = await fetch('/api/user/upload-profile-image', {
            method: 'POST',
            body: formDataUpload,
          });
          
          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            updatePayload.avatar = imageData.imageUrl;
          }
        } catch (error) {
          console.log('Image upload failed, continuing with other updates:', error);
        }
      }

      // Include preferences
      updatePayload.preferences = {
        favoriteGenres: formData.favoriteGenres,
        preferredLanguage: formData.preferredLanguage,
        autoplay: user!.preferences.autoplay,
        adultContent: user!.preferences.adultContent,
      };

      const result = await updateProfile(updatePayload);

      if (result.success) {
        success('Profile updated successfully!');
        setIsEditing(false);
        setProfileImageFile(null);
        setProfileImagePreview(null);
      } else {
        showError(result.message || 'Failed to update profile');
      }
    } catch {
      console.error('Profile update error');
      showError('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const availableGenres = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
    'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music',
    'Mystery', 'Science Fiction', 'Thriller', 'War', 'Western'
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-netflix-red"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <NavBar />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
                <p className="text-gray-400">Manage your personal information and preferences</p>
              </div>
              
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-netflix-red hover:bg-netflix-red-dark rounded-lg transition-colors text-white"
                >
                  <Edit size={16} />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors text-white"
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 disabled:cursor-not-allowed rounded-lg transition-colors text-white"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        <span>Save</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Picture Section */}
              <div className="lg:col-span-1">
                <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Profile Picture</h3>
                  
                  {isEditing ? (
                    <ProfileImageUploader
                      currentImage={user?.avatar}
                      onImageChange={handleProfileImageChange}
                      className="mb-4"
                    />
                  ) : (
                    <div className="text-center">
                      <UserAvatar 
                        user={{
                          name: `${user?.firstName} ${user?.lastName}`,
                          email: user?.email,
                          profileImage: user?.avatar
                        }} 
                        size="2xl" 
                        className="mx-auto mb-4" 
                      />
                    </div>
                  )}
                </div>

                {/* Account Info */}
                <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-6 mt-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Account Info</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail size={16} className="text-gray-400" />
                      <span className="text-white">{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-white">
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Shield size={16} className="text-gray-400" />
                      <span className="text-white capitalize">{user.subscription.type} Plan</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Form */}
              <div className="lg:col-span-2">
                <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-6">Personal Information</h3>
                  
                  <div className="space-y-6">
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          First Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-bg-secondary border border-bg-tertiary rounded-lg focus:ring-2 focus:ring-netflix-red focus:border-transparent transition-all duration-200 text-white"
                          />
                        ) : (
                          <p className="text-white py-2">{user.firstName}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Last Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-bg-secondary border border-bg-tertiary rounded-lg focus:ring-2 focus:ring-netflix-red focus:border-transparent transition-all duration-200 text-white"
                          />
                        ) : (
                          <p className="text-white py-2">{user.lastName}</p>
                        )}
                      </div>
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Bio
                      </label>
                      {isEditing ? (
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 bg-bg-secondary border border-bg-tertiary rounded-lg focus:ring-2 focus:ring-netflix-red focus:border-transparent transition-all duration-200 text-white resize-none"
                          placeholder="Tell us about yourself..."
                        />
                      ) : (
                        <p className="text-white py-2">{user.bio || 'No bio added yet'}</p>
                      )}
                    </div>

                    {/* Country and Date of Birth */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Country
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-bg-secondary border border-bg-tertiary rounded-lg focus:ring-2 focus:ring-netflix-red focus:border-transparent transition-all duration-200 text-white"
                            placeholder="e.g., India"
                          />
                        ) : (
                          <p className="text-white py-2">{user.country || 'Not specified'}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Date of Birth
                        </label>
                        {isEditing ? (
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-bg-secondary border border-bg-tertiary rounded-lg focus:ring-2 focus:ring-netflix-red focus:border-transparent transition-all duration-200 text-white"
                          />
                        ) : (
                          <p className="text-white py-2">
                            {user.dateOfBirth 
                              ? new Date(user.dateOfBirth).toLocaleDateString() 
                              : 'Not specified'
                            }
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Preferred Language */}
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Preferred Language
                      </label>
                      {isEditing ? (
                        <select
                          name="preferredLanguage"
                          value={formData.preferredLanguage}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-bg-secondary border border-bg-tertiary rounded-lg focus:ring-2 focus:ring-netflix-red focus:border-transparent transition-all duration-200 text-white"
                        >
                          <option value="en">English</option>
                          <option value="hi">Hindi</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                        </select>
                      ) : (
                        <p className="text-white py-2 capitalize">{user.preferences.preferredLanguage}</p>
                      )}
                    </div>

                    {/* Favorite Genres */}
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Favorite Genres
                      </label>
                      {isEditing ? (
                        <div className="grid grid-cols-3 gap-2">
                          {availableGenres.map((genre) => (
                            <button
                              key={genre}
                              type="button"
                              onClick={() => handleGenreToggle(genre)}
                              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                                formData.favoriteGenres.includes(genre)
                                  ? 'border-netflix-red text-white bg-netflix-red/10'
                                  : 'border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-700/50'
                              }`}
                            >
                              {genre}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {user.preferences.favoriteGenres.length > 0 ? (
                            user.preferences.favoriteGenres.map((genre) => (
                              <span
                                key={genre}
                                className="px-3 py-1 border border-netflix-red text-white rounded-full text-sm"
                              >
                                {genre}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500 py-2">No favorite genres selected</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
