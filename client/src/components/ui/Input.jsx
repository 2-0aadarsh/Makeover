/* eslint-disable react/prop-types */

const Input = ({ labelName, type, id, placeholder, value, onChange }) => {
  return (
    <div className="input flex flex-col gap-1">
      <label htmlFor={id} className="text-sm capitalize ml-1">
        {labelName}
      </label>
      <input
        type={type}
        id={id}
        value={value} // Controlled component
        onChange={onChange}
        className="w-full p-1 px-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CC2B52]"
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input