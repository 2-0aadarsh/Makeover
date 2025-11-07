/* eslint-disable react/prop-types */
import FlexCard from "./FlexCard";

const FlexCardContainer = ({ cards, source = "other" }) => {
  return (
    <div className="w-full max-w-[1032px] flex flex-col sm:flex-row justify-center sm:justify-between gap-4 sm:gap-6 lg:gap-7 mt-4 sm:mt-6 lg:mt-8 no-scrollbar">
      {cards.map((item, index) => (
        <FlexCard item={item} key={index} source={source} />
      ))}
    </div>
  );
};

export default FlexCardContainer;
