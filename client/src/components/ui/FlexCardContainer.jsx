/* eslint-disable react/prop-types */
import FlexCard from "./FlexCard";

const FlexCardContainer = ({ cards, source = "other" }) => {
  return (
    <div className="w-full max-w-[1032px] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[clamp(1rem,2vw,1.5rem)] place-items-stretch no-scrollbar">
      {cards.map((item, index) => (
        <FlexCard item={item} key={index} source={source} />
      ))}
    </div>
  );
};

export default FlexCardContainer;
