// @/components/mainpage/GenreSection.tsx
import GenreTag from "@/components/common/GenreTag";

interface GenreSectionProps {
  selectedGenre: string;
  onGenreSelect: (genre: string) => void;
}

const GenreSection: React.FC<GenreSectionProps> = ({
  selectedGenre,
  onGenreSelect,
}) => {
  const genreTags = [
    { label: "All", width: "50px" },
    { label: "Pop", width: "59px" },
    { label: "Rock", width: "67px" },
    { label: "Rap", width: "59px" },
    { label: "Country", width: "88px" },
    { label: "Jazz", width: "62px" },
    { label: "Acoustic", width: "94px" },
    { label: "Electronic", width: "102px" },
    { label: "Classical", width: "101px" },
    { label: "Metal", width: "71px" },
    { label: "Indie", width: "73px" },
  ];

  return (
    <div className="flex overflow-hidden flex-wrap gap-3 items-start p-3 mt-2.5 w-full text-sm font-medium min-h-[56px]">
      {genreTags.map((tag, index) => (
        <GenreTag
          key={index}
          {...tag}
          onClick={() => onGenreSelect(tag.label)}
          isSelected={selectedGenre === tag.label}
        />
      ))}
    </div>
  );
};

export default GenreSection;