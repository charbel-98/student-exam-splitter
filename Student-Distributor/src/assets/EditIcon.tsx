import { useAnimation, motion } from "framer-motion";

function EditIcon({ toggleEditMode }: { toggleEditMode: () => void }) {
  const variants = {
    initial: {
      scale: 1,
      stroke: "#000000",
    },
    hover: {
      scale: [1.1],
      stroke: "green",
    },
  };
  const controls = useAnimation();
  function handleMouseEnterControls() {
    controls.start("hover");
  }

  function handleMouseLeaveControls() {
    controls.start("initial");
  }
  return (
    <svg
      onMouseEnter={handleMouseEnterControls}
      onMouseLeave={handleMouseLeaveControls}
      xmlns="http://www.w3.org/2000/svg"
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      fill="none"
      onClick={toggleEditMode}
      className="cursor-pointer"
    >
      <motion.path
        variants={variants}
        initial="initial"
        animate={controls}
        d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H9M15 5H17C18.1046 5 19 5.89543 19 7V9"
        stroke="#000000"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <motion.path
        variants={variants}
        initial="initial"
        animate={controls}
        d="M14.902 20.3343L12.7153 20.7716L13.1526 18.585C13.1914 18.3914 13.2865 18.2136 13.4261 18.074L17.5 14L19.5 12L21.4869 13.9869L19.4869 15.9869L15.413 20.0608C15.2734 20.2004 15.0956 20.2956 14.902 20.3343Z"
        stroke="#000000"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <motion.path
        variants={variants}
        initial="initial"
        animate={controls}
        d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
        stroke="#000000"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

export default EditIcon;
