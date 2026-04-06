/**
 * Intl.Segmenter のポリフィルをセットアップする関数
 */
async function setupPolyfills() {
  if (!window.Intl || !window.Intl.Segmenter) {
    console.info("Intl.Segmenter is not supported. Loading polyfill...");

    // polyfillの読み込み (npm packageのCDN版を利用)
    // esm.sh は自動的に依存関係を処理してくれることが多いです
    await import("https://esm.sh/intl-segmenter");
  }
}

/**
 * メインのアプリケーションロジック
 */
async function initApp() {
  await setupPolyfills();

  // Intl.Segmenter の動作確認用
  const text = "こんにちは、世界！";
  const segmenter = new Intl.Segmenter("ja", { granularity: "grapheme" });
  const segments = segmenter.segment(text);

  console.log("Segments:");
  for (const { segment } of segments) {
    console.log(segment);
  }
}

// 実行
initApp().catch(console.error);

const segmenter = new Intl.Segmenter("ja-JP", { granularity: "grapheme" });

function split_normal(text) {
  return Array.from(segmenter.segment(text), (s) => s.segment);
}
function split_fast(text) {
  return Array.from(text);
}

function sort_chars(array) {
  return array.sort((a, b) => {
    // a, b が空文字でないことを前提に codePointAt(0) で比較
    return (a.codePointAt(0) || 0) - (b.codePointAt(0) || 0);
  });
}

function shuffle_chars(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // 分割代入による要素の入れ替え（in-place）
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const exec_button = document.getElementById("exec");
const exec_fast_button = document.getElementById("exec_fast");
const exec_random_button = document.getElementById("exec_random");
const exec_fast_random_button = document.getElementById("exec_fast_random");

const source_text = document.getElementById("source_text");
const output_text = document.getElementById("output_text");

exec_button.addEventListener("click", () => {
  const text = source_text.value;
  const chars = split_normal(text);
  const sorted = sort_chars(chars);
  output_text.value = sorted.join("");
});

exec_fast_button.addEventListener("click", () => {
  const text = source_text.value;
  const chars = split_fast(text);
  const sorted = sort_chars(chars);
  output_text.value = sorted.join("");
});

exec_random_button.addEventListener("click", () => {
  const text = source_text.value;
  const chars = split_normal(text);
  const shuffled = shuffle_chars(chars);
  output_text.value = shuffled.join("");
});

exec_fast_random_button.addEventListener("click", () => {
  const text = source_text.value;
  const chars = split_fast(text);
  const shuffled = shuffle_chars(chars);
  output_text.value = shuffled.join("");
});
