import styles from "@/styles/avatarshimmer.module.scss";

const AvatarShimmer = ({ className = "" }) => {
  return (
    <div className={className}>
      <div className={`z-10 ${styles.outerring}`}>
        <div className={styles.innerring}></div>
      </div>
    </div>
  );
};

export default AvatarShimmer;
