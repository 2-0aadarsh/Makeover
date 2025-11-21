/* eslint-disable react/prop-types */
import GridCard from "./GridCard";

const GridCardContainer = ({ gridCard, category }) => {
  return (
    <div className="card-container grid grid-cols-1 sm:grid-cols-2 w-full max-w-[1032px] gap-3 sm:gap-4 lg:gap-5 mt-4 sm:mt-5 lg:mt-6 no-scrollbar lg:mr-0">
      <GridCard gridCardData={gridCard} category={category} />
    </div>
  );
};

export default GridCardContainer;
