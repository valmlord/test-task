async function fetchDataFromAPI() {
  try {
    const response = await fetch('services.json');
    const data = await response.json();
    return data.services;
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
    return [];
  }
}
function compareBySortHead(a, b) {
  return a.sorthead - b.sorthead;
}

function buildTree(data, parentNodeId = null, level = 0) {
  const parentNode = document.createElement('div');
  parentNode.classList.add('tree-node');

  data
    .filter((service) => service.head === parentNodeId)
    .sort(compareBySortHead)
    .forEach((service) => {
      const nodeElement = document.createElement('div');
      const textContent =
        service.node === 1
          ? `${service.name}`
          : `${service.name} (${service.price.toFixed(2)})`;
      nodeElement.textContent = textContent;
      nodeElement.style.marginLeft = `${level * 10}px`;
      parentNode.appendChild(nodeElement);

      if (service.node === 1) {
        const childTree = buildTree(data, service.id, level + 1);
        parentNode.appendChild(childTree);
      }
    });

  return parentNode;
}

document.addEventListener('DOMContentLoaded', async () => {
  const services = await fetchDataFromAPI();
  if (services.length) {
    const treeContainer = document.getElementById('tree-container');
    const treeStructure = buildTree(services);
    treeContainer.appendChild(treeStructure);
  } else {
    document.getElementById('tree-container').textContent =
      'Сервисы недоступны или произошла ошибка при загрузке.';
  }
});