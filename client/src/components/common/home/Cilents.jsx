import estee from "../../../assets/brands/estee.png";
import sugar from "../../../assets/brands/sugar.png";
import bobbi from "../../../assets/brands/bobbi.png";
import huda from "../../../assets/brands/huda.png";
import mac from "../../../assets/brands/mac.png";
import o3 from "../../../assets/brands/o3.png";
import raaga from "../../../assets/brands/raaga.png";

const Cilents = () => {
  const brands = [
    { id: 1, src: huda, alt: "Huda Beauty" },
    { id: 2, src: estee, alt: "Estee Lauder" },
    { id: 3, src: mac, alt: "MAC" },
    { id: 4, src: bobbi, alt: "Bobbi Brown" },
    { id: 5, src: raaga, alt: "Raaga" },
    { id: 6, src: o3, alt: "O3+" },
    { id: 7, src: sugar, alt: "Sugar" },
  ];

  return (
    <section className="w-full bg-[#F4E1E6] py-4 sm:py-6 md:py-8 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-10">
      <h2 className="text-center text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-semibold text-[#D32F4C] mb-3 sm:mb-4 md:mb-6 lg:mb-10">
        Wemakeover Professionals Use
      </h2>

      <div className="flex justify-center items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 xl:gap-8 2xl:gap-10 overflow-x-auto">
        {brands.map((brand) => (
          <img
            key={brand.id}
            src={brand.src}
            alt={brand.alt}
            className="h-6 sm:h-8 md:h-10 lg:h-12 xl:h-14 2xl:h-16 object-contain transition-transform hover:scale-110 flex-shrink-0"
          />
        ))}
      </div>
    </section>
  );
};

export default Cilents;
