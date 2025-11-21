/* eslint-disable react/prop-types */
import GridCard from "./GridCard";

const GridCardContainer = ({ gridCard, category }) => {
  return (
    <div className="card-container grid grid-cols-1 sm:grid-cols-2 w-full max-w-[1034px] gap-2 sm:gap-2 lg:gap-[10px] no-scrollbar lg:mr-0 pr-4">
      <GridCard gridCardData={gridCard} category={category} />
    </div>
  );
};

export default GridCardContainer;
