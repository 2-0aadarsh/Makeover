/* eslint-disable react/prop-types */
import GridCard from "./GridCard";

const GridCardContainer = ({ gridCard }) => {
  return (
    <div className="card-container grid grid-cols-1 sm:grid-cols-2 w-full max-w-[1032px] gap-3 sm:gap-4 lg:gap-5 mt-4 sm:mt-5 lg:mt-6 no-scrollbar">
      <GridCard gridCardData={gridCard} />
    </div>
  );
};

export default GridCardContainer;
