const fs = require('fs');
const path = require('path');

function parseFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const lines = fileContent.split('\n');
  const terraformBlocks = [];

  lines.forEach((line) => {
    const match = line.match(/resource\s+"(.+?)"\s*{.*?}/);

    if (match) {
      const resourceType = match[1];
      const resourceBlock = {
        type: resourceType,
        attributes: {},
      };

      const attributesMatch = line.match(/(.+?)\s*=\s*(.+?);/);

      if (attributesMatch) {
        resourceBlock.attributes[attributesMatch[1].trim()] = attributesMatch[2].trim();
      }

      terraformBlocks.push(resourceBlock);
    }
  });

  return terraformBlocks;
}

function parseDirectory(directoryPath) {
  const terraformBlocks = [];

  fs.readdirSync(directoryPath).forEach((file) => {
    const filePath = path.join(directoryPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isFile() && path.extname(file) === '.tf') {
      const fileBlocks = parseFile(filePath);

      terraformBlocks.push(...fileBlocks);
    } else if (stats.isDirectory()) {
      const dirBlocks = parseDirectory(filePath);

      terraformBlocks.push(...dirBlocks);
    }
  });

  return terraformBlocks;
}

module.exports = {
  parseFile,
  parseDirectory,
};