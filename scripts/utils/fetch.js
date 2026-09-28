export async function fetchOk(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${url}`);
  }

  return response;
}

export async function fetchJson(url) {
  const response = await fetchOk(url);
  return response.json();
}

export async function fetchImage(url) {
  const response = await fetchOk(url);
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
