const ConfirmCard = ({ setIsModalOpen, action }) => {
  if (!setIsModalOpen) return <p>setIsModalOpen is not defined</p>;
  const hideCard = (e) => {
    if (e.target.getAttribute("delete")) action();
    setIsModalOpen({ share: false, hide: false });
  };

  return (
    <div className="flex flex-col min-w-[200px] bg-[#222] px-1 py-3 rounded-md">
      <div className="flex items-center justify-center">
        <p className="text-xl font-medium">Hide this blog?</p>
      </div>

      <div className="flex justify-evenly items-center">
        <div
          className="m-2 px-1 py-0.5 grow cursor-pointer bg-red-400 rounded-full hover:bg-red-500 hover:text-white text-center flex gap-1 items-center justify-center"
          onClick={hideCard}
          delete="true"
        >
          Yes
        </div>
        <div className="m-2 px-1 py-0.5 grow cursor-pointer rounded-full  text-center hover:bg-white hover:text-[#222] " onClick={hideCard}>
          Cancel
        </div>
      </div>
    </div>
  );
};

export default ConfirmCard;
