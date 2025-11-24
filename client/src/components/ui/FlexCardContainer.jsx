/* eslint-disable react/prop-types */
import FlexCard from "./FlexCard";

const FlexCardContainer = ({ cards, source = "other" }) => {
  return (
    <div className="w-full max-w-[1032px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 place-items-stretch no-scrollbar -mt-8">
      {cards.map((item, index) => (
        <FlexCard item={item} key={index} source={source} />
      ))}
    </div>
  );
};

export default FlexCardContainer;
