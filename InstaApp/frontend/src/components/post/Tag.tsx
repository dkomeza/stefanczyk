import closeIcon from "@assets/img/post/xmark-solid.svg";

function Tag(props: { tag: string; removeTag: (tag: string) => void }) {
  return (
    <div className="tag" onClick={() => props.removeTag(props.tag)}>
      <span>{props.tag}</span>
      <img src={closeIcon} alt="close" />
    </div>
  );
}

export default Tag;
