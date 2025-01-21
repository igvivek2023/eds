export default async function decorate(block) {
  const div = document.createElement("div");
  div.classList.add("banner-content");
  div.append(...block.children);
  block.append(div);
}
