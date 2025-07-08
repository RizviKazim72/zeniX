# Genre System Documentation

## Overview

The zeniX movie app features a comprehensive, dynamic genre-based page system that allows users to explore movies and TV shows by genre. The system is built using industrial DRY principles with no code repetition.

## Architecture

### Key Components

1. **Dynamic Route**: `/app/genres/[genre]/page.tsx` - Handles all genre pages dynamically
2. **Genre Constants**: `/constants/genres.ts` - Genre configurations and mappings
3. **Custom Hook**: `/hooks/useGenreData.ts` - Data fetching and state management
4. **TMDB Service**: `/services/tmdb-api.ts` - API calls for genre-based content
5. **Sidebar Navigation**: `/constants/sidebar.ts` - Genre navigation links

### Available Genres

Currently implemented genres:
- Action (`/genres/action`)
- Adventure (`/genres/adventure`) 
- Animation (`/genres/animation`)
- Comedy (`/genres/comedy`)
- Crime (`/genres/crime`)
- Documentary (`/genres/documentary`)
- Drama (`/genres/drama`)
- Family (`/genres/family`)
- Fantasy (`/genres/fantasy`)
- History (`/genres/history`)
- Horror (`/genres/horror`)
- Music (`/genres/music`)
- Mystery (`/genres/mystery`)
- Sci-Fi (`/genres/sci-fi`)
- Thriller (`/genres/thriller`)
- War (`/genres/war`)
- Western (`/genres/western`)

## Features

### Page Features
- **Netflix-style Layout**: Glass-morphism design with dark theme
- **View Modes**: Grid and List view toggles
- **Content Filtering**: All, Movies, TV Shows filters
- **Responsive Design**: Mobile-first approach
- **SEO Optimized**: Proper meta tags and structured data

### Technical Features
- **DRY Principle**: Single dynamic route handles all genres
- **Type Safety**: Full TypeScript implementation
- **Error Handling**: Comprehensive error states
- **Loading States**: Skeleton loaders and spinners
- **Caching**: Efficient data caching
- **Performance**: Optimized with React best practices

## How to Add New Genres

### Step 1: Add Genre Configuration

Edit `/constants/genres.ts` and add your new genre to the `GENRE_MAPPINGS` object:

```typescript
newgenre: {
  id: 'newgenre',
  name: 'New Genre',
  movieGenreId: TMDB_MOVIE_ID, // Get from TMDB API docs
  tvGenreId: TMDB_TV_ID,       // Get from TMDB API docs  
  description: 'Your genre description',
  backgroundColor: 'from-color-900/20 to-color-900/20',
  icon: '🎬' // Choose appropriate emoji
}
```

### Step 2: Add Navigation Link

Edit `/constants/sidebar.ts` and add the new genre to `GenresSideBarLinks`:

```typescript
{
  id: XX,
  name: "New Genre",
  path: "/genres/newgenre",
}
```

### Step 3: Test the Implementation

The dynamic route will automatically handle the new genre. Test by navigating to `/genres/newgenre`.

## API Integration

### TMDB Service Methods

The system uses these key methods from `TMDBService`:

- `getMoviesByGenre(genreId, page)` - Fetch movies by genre
- `getTVShowsByGenre(genreId, page)` - Fetch TV shows by genre  
- `getMediaByGenre(movieGenreId, tvGenreId, page)` - Fetch both movies and TV

### Custom Hook

The `useGenreData` hook provides:

```typescript
{
  movies: Movie[],
  tvShows: TVShow[],
  loading: boolean,
  error: string | null,
  genreConfig: GenreConfig | null,
  refetch: () => Promise<void>
}
```

## Styling System

### Design System
- **Colors**: Netflix red (#E50914) as primary accent
- **Backgrounds**: Glass-morphism with backdrop blur
- **Typography**: Modern sans-serif with proper hierarchy
- **Animations**: Framer Motion for smooth interactions
- **Responsive**: Tailwind CSS breakpoints

### Theme Consistency
All genre pages inherit the same design system:
- Dark background (`bg-bg-primary`)
- Glass components (`backdrop-blur-lg`)
- Netflix red accents
- Consistent spacing and typography

## Performance Optimizations

1. **Lazy Loading**: Images load on demand
2. **Pagination**: Content loads in chunks
3. **Caching**: API responses cached for better UX
4. **Code Splitting**: Dynamic imports where appropriate
5. **SEO**: Static metadata generation

## Error Handling

The system includes comprehensive error handling:

- **Network Errors**: Retry mechanisms
- **404 Pages**: Invalid genre handling  
- **Loading States**: Skeleton components
- **Empty States**: No content messages

## Future Enhancements

Potential improvements:
1. **Static Generation**: Pre-generate popular genre pages
2. **Search within Genre**: Filter within genre results
3. **Sorting Options**: Multiple sort criteria
4. **Personalization**: User-specific genre recommendations
5. **Genre Combinations**: Multi-genre filtering

## Testing

To test the genre system:

1. Navigate to `/genres` for the index page
2. Visit any `/genres/{genre-slug}` for specific genres
3. Test view mode toggles (grid/list)
4. Test content filters (all/movies/tv)
5. Test load more functionality
6. Test responsive design on different devices

## Maintenance

### Adding TMDB Genre IDs

When adding new genres, refer to:
- TMDB Movie Genres API: `/genre/movie/list`
- TMDB TV Genres API: `/genre/tv/list`

### Updating Descriptions

Genre descriptions should be:
- Engaging and descriptive
- Consistent in tone
- Under 100 characters
- Family-friendly

## Conclusion

The genre system is built for scalability and maintainability. Adding new genres requires minimal code changes, and the system automatically handles routing, data fetching, and UI rendering for all genres.
