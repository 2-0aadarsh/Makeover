/* eslint-disable react/prop-types */
import FlexCard from "./FlexCard";

const FlexCardContainer = ({ cards }) => {
  return (
    <div className="w-[1032px] flex justify-between gap-7">
      {cards.map((item, index) => (
        <FlexCard item={item} key={index} />
      ))}
    </div>
  );
};

export default FlexCardContainer