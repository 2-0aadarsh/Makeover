import PropTypes from 'prop-types';
import { useNewsletter } from '../../hooks/useNewsletter';

/**
 * Reusable Newsletter Subscription Component
 * Can be used anywhere with different variants and styling
 * 
 * @param {Object} props
 * @param {string} props.source - Source identifier for tracking
 * @param {string} props.variant - UI variant: 'default', 'minimal', 'inline', 'footer'
 * @param {string} props.title - Optional title
 * @param {string} props.description - Optional description
 * @param {string} props.placeholder - Input placeholder
 * @param {string} props.buttonText - Submit button text
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.showTitle - Whether to show title
 * @param {boolean} props.showDescription - Whether to show description
 */
const NewsletterSubscription = ({
  source = 'other',
  variant = 'default',
  title = 'Subscribe For Newsletters',
  description = 'Subscribe to receive the latest news and updates about Makeover. We promise not to spam you!',
  placeholder = 'Enter your email',
  buttonText = 'Subscribe',
  className = '',
  showTitle = true,
  showDescription = true,
}) => {
  const {
    email,
    isSubmitting,
    submitMessage,
    handleChange,
    handleSubmit,
  } = useNewsletter(source);

  // Render based on variant
  switch (variant) {
    case 'minimal':
      return (
        <MinimalVariant
          email={email}
          isSubmitting={isSubmitting}
          submitMessage={submitMessage}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          placeholder={placeholder}
          buttonText={buttonText}
          className={className}
        />
      );

    case 'inline':
      return (
        <InlineVariant
          email={email}
          isSubmitting={isSubmitting}
          submitMessage={submitMessage}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          placeholder={placeholder}
          buttonText={buttonText}
          className={className}
        />
      );

    case 'footer':
      return (
        <FooterVariant
          email={email}
          isSubmitting={isSubmitting}
          submitMessage={submitMessage}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          title={title}
          description={description}
          placeholder={placeholder}
          buttonText={buttonText}
          showTitle={showTitle}
          showDescription={showDescription}
          className={className}
        />
      );

    case 'default':
    default:
      return (
        <DefaultVariant
          email={email}
          isSubmitting={isSubmitting}
          submitMessage={submitMessage}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          title={title}
          description={description}
          placeholder={placeholder}
          buttonText={buttonText}
          showTitle={showTitle}
          showDescription={showDescription}
          className={className}
        />
      );
  }
};

// Default Variant - Full featured with title and description
const DefaultVariant = ({
  email,
  isSubmitting,
  submitMessage,
  handleChange,
  handleSubmit,
  title,
  description,
  placeholder,
  buttonText,
  showTitle,
  showDescription,
  className,
}) => (
  <div className={`w-full p-6 sm:p-8 md:p-12 lg:p-20 bg-[#CC2B52] rounded-2xl text-white flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10 ${className}`}>
    <div className="w-full lg:w-1/2 font-medium text-xl sm:text-2xl md:text-3xl lg:text-[28px] leading-tight sm:leading-relaxed flex flex-col items-start gap-3 md:gap-4">
      {showTitle && <h3>{title}</h3>}
      {showDescription && (
        <p className="font-normal text-sm sm:text-base md:text-lg lg:text-[18px] pr-0 lg:pr-10 tracking-normal">
          {description}
        </p>
      )}
    </div>

    <div className="w-full lg:w-1/2 flex flex-col items-center justify-center lg:justify-end gap-3">
      <form
        onSubmit={handleSubmit}
        className="w-full sm:w-96 lg:w-[422px] h-12 sm:h-14 bg-white rounded-lg relative"
      >
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full h-full rounded-lg text-black px-4 text-sm outline-none"
          required
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-[#CC2B52] absolute right-1 top-1 bottom-1 px-4 sm:px-6 md:px-9 py-1 sm:py-2 text-xs sm:text-sm capitalize rounded-[8px] ${
            isSubmitting
              ? 'opacity-70 cursor-not-allowed'
              : 'cursor-pointer hover:bg-[#B02547]'
          }`}
        >
          {isSubmitting ? 'Subscribing...' : buttonText}
        </button>
      </form>

      {submitMessage.text && (
        <MessageDisplay message={submitMessage} />
      )}
    </div>
  </div>
);

// Minimal Variant - Just input and button, no background
const MinimalVariant = ({
  email,
  isSubmitting,
  submitMessage,
  handleChange,
  handleSubmit,
  placeholder,
  buttonText,
  className,
}) => (
  <div className={`w-full flex flex-col gap-3 ${className}`}>
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md h-12 bg-white border-2 border-gray-200 rounded-lg relative"
    >
      <input
        type="email"
        name="email"
        value={email}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full h-full rounded-lg text-black px-4 text-sm outline-none"
        required
        disabled={isSubmitting}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className={`bg-[#CC2B52] absolute right-1 top-1 bottom-1 px-6 py-1 text-xs text-white capitalize rounded-md ${
          isSubmitting
            ? 'opacity-70 cursor-not-allowed'
            : 'cursor-pointer hover:bg-[#B02547]'
        }`}
      >
        {isSubmitting ? 'Subscribing...' : buttonText}
      </button>
    </form>

    {submitMessage.text && (
      <MessageDisplay message={submitMessage} />
    )}
  </div>
);

// Inline Variant - Horizontal layout, compact
const InlineVariant = ({
  email,
  isSubmitting,
  submitMessage,
  handleChange,
  handleSubmit,
  placeholder,
  buttonText,
  className,
}) => (
  <div className={`w-full flex flex-col gap-2 ${className}`}>
    <form
      onSubmit={handleSubmit}
      className="flex flex-row gap-2 w-full max-w-lg"
    >
      <input
        type="email"
        name="email"
        value={email}
        onChange={handleChange}
        placeholder={placeholder}
        className="flex-1 h-10 rounded-lg border-2 border-gray-200 text-black px-4 text-sm outline-none focus:border-[#CC2B52]"
        required
        disabled={isSubmitting}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className={`bg-[#CC2B52] px-6 py-2 text-sm text-white capitalize rounded-lg whitespace-nowrap ${
          isSubmitting
            ? 'opacity-70 cursor-not-allowed'
            : 'cursor-pointer hover:bg-[#B02547]'
        }`}
      >
        {isSubmitting ? 'Subscribing...' : buttonText}
      </button>
    </form>

    {submitMessage.text && (
      <MessageDisplay message={submitMessage} compact />
    )}
  </div>
);

// Footer Variant - Dark theme suitable for footer
const FooterVariant = ({
  email,
  isSubmitting,
  submitMessage,
  handleChange,
  handleSubmit,
  title,
  description,
  placeholder,
  buttonText,
  showTitle,
  showDescription,
  className,
}) => (
  <div className={`w-full flex flex-col gap-4 ${className}`}>
    {showTitle && (
      <h3 className="text-lg font-semibold text-white">{title}</h3>
    )}
    {showDescription && (
      <p className="text-sm text-gray-300 mb-2">{description}</p>
    )}
    
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md h-11 bg-white rounded-lg relative"
    >
      <input
        type="email"
        name="email"
        value={email}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full h-full rounded-lg text-black px-4 text-sm outline-none"
        required
        disabled={isSubmitting}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className={`bg-[#CC2B52] absolute right-1 top-1 bottom-1 px-5 py-1 text-xs text-white capitalize rounded-md ${
          isSubmitting
            ? 'opacity-70 cursor-not-allowed'
            : 'cursor-pointer hover:bg-[#B02547]'
        }`}
      >
        {isSubmitting ? 'Subscribing...' : buttonText}
      </button>
    </form>

    {submitMessage.text && (
      <MessageDisplay message={submitMessage} />
    )}
  </div>
);

// Message Display Component
const MessageDisplay = ({ message, compact = false }) => (
  <div
    className={`w-full ${compact ? 'max-w-lg' : 'sm:w-96 lg:w-[422px]'} p-3 rounded-lg text-sm font-medium ${
      message.type === 'success'
        ? 'bg-green-100 text-green-800 border border-green-200'
        : message.type === 'error'
        ? 'bg-red-100 text-red-800 border border-red-200'
        : 'bg-blue-100 text-blue-800 border border-blue-200'
    }`}
  >
    {message.text}
  </div>
);

NewsletterSubscription.propTypes = {
  source: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'minimal', 'inline', 'footer']),
  title: PropTypes.string,
  description: PropTypes.string,
  placeholder: PropTypes.string,
  buttonText: PropTypes.string,
  className: PropTypes.string,
  showTitle: PropTypes.bool,
  showDescription: PropTypes.bool,
};

DefaultVariant.propTypes = {
  email: PropTypes.string.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  submitMessage: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  placeholder: PropTypes.string,
  buttonText: PropTypes.string,
  showTitle: PropTypes.bool,
  showDescription: PropTypes.bool,
  className: PropTypes.string,
};

MinimalVariant.propTypes = {
  email: PropTypes.string.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  submitMessage: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  buttonText: PropTypes.string,
  className: PropTypes.string,
};

InlineVariant.propTypes = {
  email: PropTypes.string.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  submitMessage: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  buttonText: PropTypes.string,
  className: PropTypes.string,
};

FooterVariant.propTypes = {
  email: PropTypes.string.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  submitMessage: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  placeholder: PropTypes.string,
  buttonText: PropTypes.string,
  showTitle: PropTypes.bool,
  showDescription: PropTypes.bool,
  className: PropTypes.string,
};

MessageDisplay.propTypes = {
  message: PropTypes.shape({
    type: PropTypes.string,
    text: PropTypes.string,
  }).isRequired,
  compact: PropTypes.bool,
};

export default NewsletterSubscription;


