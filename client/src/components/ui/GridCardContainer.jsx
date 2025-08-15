/* eslint-disable react/prop-types */
import GridCard from "./GridCard";

const GridCardContainer = ({ gridCard }) => {

  return (
    <div className="card-container grid grid-cols-2 w-[1032px] gap-5 mt-5">
      <GridCard gridCardData={gridCard} />
    </div>
  );
};

export default GridCardContainer