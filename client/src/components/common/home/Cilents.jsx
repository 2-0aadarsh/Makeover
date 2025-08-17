
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
    <section className="w-full bg-[#F4E1E6] py-20 px-10">
      <h2 className="text-center text-xl sm:text-2xl font-semibold text-[#D32F4C] mb-10">
        Makeover Professionals Use
      </h2>

      <div className="flex flex-wrap justify-center items-center gap-10">
        {brands.map((brand) => (
          <img
            key={brand.id}
            src={brand.src}
            alt={brand.alt}
            className="h-10 sm:h-14 object-contain transition-transform hover:scale-110"
          />
        ))}
      </div>
    </section>
  );
};

export default Cilents
