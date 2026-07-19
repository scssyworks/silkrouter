function formatBytes(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const units = ['kB', 'MB', 'GB'];
  let size = bytes / 1024;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export function filesize() {
  return {
    name: 'custom-filesize',
    generateBundle(_options, bundle) {
      for (const chunkOrAsset of Object.values(bundle)) {
        if (chunkOrAsset.type !== 'chunk' && chunkOrAsset.type !== 'asset') {
          continue;
        }

        const source =
          chunkOrAsset.type === 'chunk'
            ? chunkOrAsset.code
            : chunkOrAsset.source;
        const size = Buffer.byteLength(source || '', 'utf8');

        console.info(
          `[filesize] ${chunkOrAsset.fileName}: ${formatBytes(size)}`,
        );
      }
    },
  };
}
