/* eslint-disable react/prop-types */
import GridCard from "./GridCard";

const GridCardContainer = ({ gridCard, category }) => {
  return (
    <div className="card-container grid grid-cols-1 md:grid-cols-2 w-full max-w-[1034px] gap-[clamp(0.75rem,2vw,1rem)] no-scrollbar">
      <GridCard gridCardData={gridCard} category={category} />
    </div>
  );
};

export default GridCardContainer;
