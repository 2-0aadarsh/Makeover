/* eslint-disable react/prop-types */
import FlexCard from "./FlexCard";

const FlexCardContainer = ({ cards, source = "other" }) => {
  return (
    <div className="w-full max-w-[1032px] flex flex-col sm:flex-row justify-center sm:justify-between gap-4 sm:gap-6 lg:gap-7  sm:mt-2  no-scrollbar -mt-8 ">
      {cards.map((item, index) => (
        <FlexCard item={item} key={index} source={source} />
      ))}
    </div>
  );
};

export default FlexCardContainer;
