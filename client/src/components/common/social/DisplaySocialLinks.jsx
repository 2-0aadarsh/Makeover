/* eslint-disable react/prop-types */
const DisplaySocialLinks = ({ socialIcons }) => {
  return (
    <div className="flex gap-5 text-xl text-[#CC2B52]">
      {socialIcons.map((item) => (
        <a
          key={item.id}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-125 transition-all duration-300"
        >
          {item.icon}
        </a>
      ))}
    </div>
  );
};

export default DisplaySocialLinks;
