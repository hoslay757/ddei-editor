
const modules = import.meta.glob('./icons/*', { eager: true });

const ICONS = {};
for (let i in modules) {
  let icon = modules[i];
  let newI = i.substring(i.lastIndexOf('/') + 1, i.lastIndexOf('.'))
  ICONS[newI] = icon.default;
}

export default ICONS;
