export interface FilterOption {
  value: string;
  label: string;
}

export const typeOptions: FilterOption[] = [
  { value: "all", label: "All Content" },
  { value: "movie", label: "Movies" },
  { value: "tv", label: "TV Shows" },
  { value: "person", label: "People" },
];

export const genreOptions: FilterOption[] = [
  { value: "all", label: "All Genres" },
  { value: "28", label: "Action" },
  { value: "12", label: "Adventure" },
  { value: "16", label: "Animation" },
  { value: "35", label: "Comedy" },
  { value: "80", label: "Crime" },
  { value: "18", label: "Drama" },
  { value: "14", label: "Fantasy" },
  { value: "27", label: "Horror" },
  { value: "878", label: "Sci-Fi" },
  { value: "53", label: "Thriller" },
];

export const yearOptions: FilterOption[] = [
  { value: "all", label: "All Years" },
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
  { value: "2022", label: "2022" },
  { value: "2021", label: "2021" },
  { value: "2020", label: "2020" },
];

export const sortOptions: FilterOption[] = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "vote_average.desc", label: "Highest Rated" },
  { value: "release_date.desc", label: "Newest First" },
  { value: "revenue.desc", label: "Highest Grossing" },
];
