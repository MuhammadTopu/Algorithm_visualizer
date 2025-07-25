let array = [];
let algorithm = null;
let isSorting = false;
let speed = 100; // Default speed in ms
let startTime = null;
let comparisons = 0;
let swaps = 0;
let currentAlgorithmInfo = null;

// Initialize the array
function initArray(size = 15) {
  array = Array.from({length: size}, () => Math.floor(Math.random() * 95) + 5);
  createArrayBars();
}

// Create visual bars
function createArrayBars() {
  const container = document.getElementById('array-container');
  container.innerHTML = '';
  
  const maxHeight = Math.max(...array);
  const containerHeight = container.clientHeight;
  
  array.forEach((value, index) => {
    const bar = document.createElement('div');
    const height = (value / maxHeight) * containerHeight * 0.9;
    bar.style.height = `${height}px`;
    bar.style.width = `${100 / array.length}%`;
    bar.classList.add('array-bar');
    bar.setAttribute('data-value', value);
    bar.setAttribute('data-index', index);
    container.appendChild(bar);
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms || speed));
}

async function swap(i, j, bars) {
  [array[i], array[j]] = [array[j], array[i]];
  swaps++;
  updatePerformanceMetrics();
  
  if (bars) {
    bars[i].style.backgroundColor = 'red';
    bars[j].style.backgroundColor = 'red';
    
    // Visual swap
    const tempHeight = bars[i].style.height;
    bars[i].style.height = bars[j].style.height;
    bars[j].style.height = tempHeight;
    
    await delay();
    bars[i].style.backgroundColor = 'steelblue';
    bars[j].style.backgroundColor = 'steelblue';
  }
}

function selectAlgorithm(algorithmName) {
  if (isSorting) return;
  algorithm = algorithmName;
  
  const algorithms = [
    {
      name: 'Bubble Sort',
      key: 'bubbleSort',
      time: {
        worst: 'O(n²)',
        best: 'O(n)',
        average: 'O(n²)'
      },
      space: 'O(1)',
      description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.'
    },
    {
      name: 'Selection Sort',
      key: 'selectionSort',
      time: {
        worst: 'O(n²)',
        best: 'O(n²)',
        average: 'O(n²)'
      },
      space: 'O(1)',
      description: 'Divides the input list into two parts: a sorted sublist and an unsorted sublist. It repeatedly finds the minimum element from the unsorted part and moves it to the sorted part.'
    },
    {
      name: 'Insertion Sort',
      key: 'insertionSort',
      time: {
        worst: 'O(n²)',
        best: 'O(n)',
        average: 'O(n²)'
      },
      space: 'O(1)',
      description: 'Builds the final sorted array one item at a time by repeatedly taking the next item and inserting it into the correct position.'
    },
    {
      name: 'Merge Sort',
      key: 'mergeSort',
      time: {
        worst: 'O(n log n)',
        best: 'O(n log n)',
        average: 'O(n log n)'
      },
      space: 'O(n)',
      description: 'A divide-and-conquer algorithm that divides the input array into two halves, sorts them recursively, and then merges the two sorted halves.'
    },
    {
      name: 'Quick Sort',
      key: 'quickSort',
      time: {
        worst: 'O(n²)',
        best: 'O(n log n)',
        average: 'O(n log n)'
      },
      space: 'O(log n)',
      description: 'Picks an element as pivot and partitions the array around the pivot. It recursively sorts the sub-arrays.'
    },
    {
      name: 'Heap Sort',
      key: 'heapSort',
      time: {
        worst: 'O(n log n)',
        best: 'O(n log n)',
        average: 'O(n log n)'
      },
      space: 'O(1)',
      description: 'Creates a heap data structure and repeatedly extracts the maximum element from the heap.'
    },
    {
      name: 'Shell Sort',
      key: 'shellSort',
      time: {
        worst: 'O(n²)',
        best: 'O(n log n)',
        average: 'Depends on gap sequence'
      },
      space: 'O(1)',
      description: 'An optimization of insertion sort that allows the exchange of items that are far apart.'
    },
    {
      name: 'Counting Sort',
      key: 'countingSort',
      time: {
        worst: 'O(n + k)',
        best: 'O(n + k)',
        average: 'O(n + k)'
      },
      space: 'O(n + k)',
      description: 'Works by counting the number of objects that have distinct key values, then doing arithmetic to calculate the positions of each key.'
    },
    {
      name: 'Radix Sort',
      key: 'radixSort',
      time: {
        worst: 'O(nk)',
        best: 'O(nk)',
        average: 'O(nk)'
      },
      space: 'O(n + k)',
      description: 'Sorts numbers by processing individual digits from least significant to most significant.'
    },
    {
      name: 'Bucket Sort',
      key: 'bucketSort',
      time: {
        worst: 'O(n²)',
        best: 'O(n + k)',
        average: 'O(n + k)'
      },
      space: 'O(n + k)',
      description: 'Distributes the elements of an array into a number of buckets, then sorts each bucket individually.'
    },
    {
      name: 'Bogo Sort',
      key: 'bogoSort',
      time: {
        worst: 'O(∞)',
        best: 'O(n)',
        average: 'O(n × n!)'
      },
      space: 'O(1)',
      description: 'A joke algorithm that generates permutations of its input until it finds one that is sorted.'
    },
    {
      name: 'Cocktail Sort',
      key: 'cocktailSort',
      time: {
        worst: 'O(n²)',
        best: 'O(n)',
        average: 'O(n²)'
      },
      space: 'O(1)',
      description: 'A variation of bubble sort that sorts in both directions alternately.'
    },
    {
      name: 'Gnome Sort',
      key: 'gnomeSort',
      time: {
        worst: 'O(n²)',
        best: 'O(n)',
        average: 'O(n²)'
      },
      space: 'O(1)',
      description: 'Similar to insertion sort but moving elements to their proper place by a series of swaps.'
    },
    {
      name: 'Comb Sort',
      key: 'combSort',
      time: {
        worst: 'O(n²)',
        best: 'O(n log n)',
        average: 'O(n²/2^p)'
      },
      space: 'O(1)',
      description: 'An improvement on bubble sort that uses varying gap sizes between compared elements.'
    },
    {
      name: 'Cycle Sort',
      key: 'cycleSort',
      time: {
        worst: 'O(n²)',
        best: 'O(n²)',
        average: 'O(n²)'
      },
      space: 'O(1)',
      description: 'An in-place sorting algorithm that minimizes the number of writes to memory.'
    },
    {
      name: 'Tim Sort',
      key: 'timSort',
      time: {
        worst: 'O(n log n)',
        best: 'O(n)',
        average: 'O(n log n)'
      },
      space: 'O(n)',
      description: 'A hybrid sorting algorithm derived from merge sort and insertion sort, used in Python and Java.'
    }
  ];
  


  // Find the algorithm info
  currentAlgorithmInfo = algorithms.find(algo => algo.key === algorithmName);
  
  // Update the info panel
  document.getElementById('algorithm-info').style.display = 'block';
  document.getElementById('algorithm-name').textContent = currentAlgorithmInfo.name;
  document.getElementById('algorithm-description').textContent = currentAlgorithmInfo.description;
  document.getElementById('time-best').textContent = currentAlgorithmInfo.time.best;
  document.getElementById('time-average').textContent = currentAlgorithmInfo.time.average;
  document.getElementById('time-worst').textContent = currentAlgorithmInfo.time.worst;
  document.getElementById('space-complexity').textContent = currentAlgorithmInfo.space;
  
  // Reset performance metrics
  resetMetrics();
  initArray();
}

async function startSorting() {
  if (isSorting || !algorithm) return;
  
  isSorting = true;
  document.getElementById('start-btn').disabled = true;
  
  resetMetrics();
  startTime = performance.now();
  updatePerformanceMetrics();
  
  try {
    switch(algorithm) {
      case 'bubbleSort':
        await bubbleSort();
        break;
      case 'selectionSort':
        await selectionSort();
        break;
      case 'insertionSort':
        await insertionSort();
        break;
      case 'mergeSort':
        await mergeSort();
        break;
      case 'quickSort':
        await quickSort();
        break;
      case 'heapSort':
        await heapSort();
        break;
      case 'shellSort':
        await shellSort();
        break;
      case 'countingSort':
        await countingSort();
        break;
      case 'radixSort':
        await radixSort();
        break;
      case 'bucketSort':
        await bucketSort();
        break;
      case 'bogoSort':
        await bogoSort();
        break;
      case 'cocktailSort':
        await cocktailSort();
        break;
      case 'gnomeSort':
        await gnomeSort();
        break;
      case 'combSort':
        await combSort();
        break;
      case 'cycleSort':
        await cycleSort();
        break;
      case 'timSort':
        await timSort();
        break;
    }
  } finally {
    // Ensure we always update the time when sorting stops
    updatePerformanceMetrics();
  }
  
  // Visualize completion
  const bars = document.querySelectorAll('.array-bar');
  for (let i = 0; i < bars.length; i++) {
    bars[i].style.backgroundColor = 'green';
    await delay(50);
  }
  
  isSorting = false;
  document.getElementById('start-btn').disabled = false;
}

function resetArray() {
  if (isSorting) return;
  initArray();
  resetMetrics();
}

function changeSpeed(newSpeed) {
  speed = 510 - newSpeed; 
}

function stop() {
  if (isSorting) {
    isSorting = false; 
    document.getElementById('start-btn').disabled = false; 
    updatePerformanceMetrics();
  }

  const bars = document.querySelectorAll('.array-bar');
  bars.forEach((bar, index) => {
    bar.style.backgroundColor = 'steelblue'; 
    bar.style.height = `${(array[index] / Math.max(...array)) * 90}%`;
    bar.setAttribute('data-value', array[index]); 
  });
}

function resetMetrics() {
  comparisons = 0;
  swaps = 0;
  startTime = null;
  document.getElementById('time-taken').textContent = '0';
  document.getElementById('comparisons').textContent = '0';
  document.getElementById('swaps').textContent = '0';
}

function updatePerformanceMetrics() {
  if (startTime) {
    const timeTaken = performance.now() - startTime;
    document.getElementById('time-taken').textContent = timeTaken.toFixed(2);
  }
  document.getElementById('comparisons').textContent = comparisons;
  document.getElementById('swaps').textContent = swaps;
}

// ========================
// SORTING ALGORITHMS
// ========================

// 1. Bubble Sort
async function bubbleSort() {
  let bars = document.querySelectorAll('.array-bar');
  let n = array.length;
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      updatePerformanceMetrics();
      bars[j].style.backgroundColor = 'red';
      bars[j + 1].style.backgroundColor = 'red';
      
      if (array[j] > array[j + 1]) {
        await swap(j, j + 1, bars);
        bars = document.querySelectorAll('.array-bar');
      }
      
      await delay();
      bars[j].style.backgroundColor = 'steelblue';
      bars[j + 1].style.backgroundColor = 'steelblue';
    }
    bars[n - i - 1].style.backgroundColor = 'green';
  }
  bars[0].style.backgroundColor = 'green';
}

// 2. Selection Sort
async function selectionSort() {
  let bars = document.querySelectorAll('.array-bar');
  let n = array.length;
  
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    bars[minIdx].style.backgroundColor = 'yellow';
    
    for (let j = i + 1; j < n; j++) {
      comparisons++;
      updatePerformanceMetrics();
      bars[j].style.backgroundColor = 'red';
      await delay();
      
      if (array[j] < array[minIdx]) {
        bars[minIdx].style.backgroundColor = 'steelblue';
        minIdx = j;
        bars[minIdx].style.backgroundColor = 'yellow';
      } else {
        bars[j].style.backgroundColor = 'steelblue';
      }
    }
    
    if (minIdx !== i) {
      await swap(i, minIdx, bars);
      bars = document.querySelectorAll('.array-bar');
    }
    
    bars[i].style.backgroundColor = 'green';
  }
  bars[n - 1].style.backgroundColor = 'green';
}

// 3. Insertion Sort
async function insertionSort() {
  let bars = document.querySelectorAll('.array-bar');
  let n = array.length;
  
  for (let i = 1; i < n; i++) {
    let key = array[i];
    let j = i - 1;
    bars[i].style.backgroundColor = 'yellow';
    
    while (j >= 0 && array[j] > key) {
      comparisons++;
      updatePerformanceMetrics();
      bars[j].style.backgroundColor = 'red';
      await delay();
      
      array[j + 1] = array[j];
      bars[j + 1].style.height = bars[j].style.height;
      bars[j + 1].setAttribute('data-value', array[j]);
      
      bars[j].style.backgroundColor = 'steelblue';
      j--;
    }
    
    array[j + 1] = key;
    bars[j + 1].style.height = `${(key / Math.max(...array)) * 90}%`;
    bars[j + 1].setAttribute('data-value', key);
    bars[i].style.backgroundColor = 'steelblue';
  }
  
  for (let i = 0; i < n; i++) {
    bars[i].style.backgroundColor = 'green';
    await delay(50);
  }
}

// 4. Merge Sort
async function mergeSort() {
  await mergeSortHelper(0, array.length - 1);
}

async function mergeSortHelper(l, r) {
  if (l >= r) return;
  
  const m = l + Math.floor((r - l) / 2);
  await mergeSortHelper(l, m);
  await mergeSortHelper(m + 1, r);
  await merge(l, m, r);
}

async function merge(l, m, r) {
  let bars = document.querySelectorAll('.array-bar');
  let n1 = m - l + 1;
  let n2 = r - m;
  
  // Create temp arrays
  let L = new Array(n1);
  let R = new Array(n2);
  
  // Copy data to temp arrays
  for (let i = 0; i < n1; i++) {
    L[i] = array[l + i];
    bars[l + i].style.backgroundColor = 'orange';
  }
  for (let j = 0; j < n2; j++) {
    R[j] = array[m + 1 + j];
    bars[m + 1 + j].style.backgroundColor = 'yellow';
  }
  
  await delay();
  
  // Merge the temp arrays
  let i = 0, j = 0, k = l;
  
  while (i < n1 && j < n2) {
    comparisons++;
    updatePerformanceMetrics();
    bars[k].style.backgroundColor = 'red';
    await delay();
    
    if (L[i] <= R[j]) {
      array[k] = L[i];
      bars[k].style.height = `${(L[i] / Math.max(...array)) * 90}%`;
      i++;
    } else {
      array[k] = R[j];
      bars[k].style.height = `${(R[j] / Math.max(...array)) * 90}%`;
      j++;
    }
    
    bars[k].style.backgroundColor = 'steelblue';
    k++;
  }
  
  // Copy remaining elements
  while (i < n1) {
    array[k] = L[i];
    bars[k].style.height = `${(L[i] / Math.max(...array)) * 90}%`;
    bars[k].style.backgroundColor = 'steelblue';
    i++;
    k++;
    await delay();
  }
  
  while (j < n2) {
    array[k] = R[j];
    bars[k].style.height = `${(R[j] / Math.max(...array)) * 90}%`;
    bars[k].style.backgroundColor = 'steelblue';
    j++;
    k++;
    await delay();
  }
  
  // Visualize sorted section
  for (let x = l; x <= r; x++) {
    bars[x].style.backgroundColor = 'green';
    await delay(30);
  }
}

// 5. Quick Sort
async function quickSort() {
  await quickSortHelper(0, array.length - 1);
}

async function quickSortHelper(low, high) {
  if (low < high) {
    let pi = await partition(low, high);
    await quickSortHelper(low, pi - 1);
    await quickSortHelper(pi + 1, high);
  }
}

async function partition(low, high) {
  let bars = document.querySelectorAll('.array-bar');
  let pivot = array[high];
  bars[high].style.backgroundColor = 'purple';
  
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    comparisons++;
    updatePerformanceMetrics();
    bars[j].style.backgroundColor = 'red';
    await delay();
    
    if (array[j] < pivot) {
      i++;
      await swap(i, j, bars);
      bars = document.querySelectorAll('.array-bar');
    }
    
    bars[j].style.backgroundColor = 'steelblue';
  }
  
  await swap(i + 1, high, bars);
  bars = document.querySelectorAll('.array-bar');
  
  for (let k = low; k <= high; k++) {
    if (k !== i + 1) {
      bars[k].style.backgroundColor = 'steelblue';
    }
  }
  
  bars[i + 1].style.backgroundColor = 'green';
  return i + 1;
}

// 6. Heap Sort
async function heapSort() {
  let n = array.length;
  let bars = document.querySelectorAll('.array-bar');
  
  // Build heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await heapify(n, i);
  }
  
  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    bars[0].style.backgroundColor = 'red';
    bars[i].style.backgroundColor = 'red';
    await delay();
    
    await swap(0, i, bars);
    bars = document.querySelectorAll('.array-bar');
    
    bars[i].style.backgroundColor = 'green';
    await heapify(i, 0);
  }
  
  bars[0].style.backgroundColor = 'green';
}

async function heapify(n, i) {
  let bars = document.querySelectorAll('.array-bar');
  let largest = i;
  let left = 2 * i + 1;
  let right = 2 * i + 2;
  
  bars[largest].style.backgroundColor = 'yellow';
  if (left < n) bars[left].style.backgroundColor = 'orange';
  if (right < n) bars[right].style.backgroundColor = 'orange';
  
  comparisons += 2;
  updatePerformanceMetrics();
  await delay();
  
  if (left < n && array[left] > array[largest]) {
    largest = left;
  }
  
  if (right < n && array[right] > array[largest]) {
    largest = right;
  }
  
  if (largest !== i) {
    await swap(i, largest, bars);
    bars = document.querySelectorAll('.array-bar');
    await heapify(n, largest);
  }
  
  bars[i].style.backgroundColor = 'steelblue';
  if (left < n) bars[left].style.backgroundColor = 'steelblue';
  if (right < n) bars[right].style.backgroundColor = 'steelblue';
}

// 7. Shell Sort
async function shellSort() {
  let bars = document.querySelectorAll('.array-bar');
  let n = array.length;
  
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      let temp = array[i];
      let j;
      bars[i].style.backgroundColor = 'red';
      
      for (j = i; j >= gap && array[j - gap] > temp; j -= gap) {
        comparisons++;
        updatePerformanceMetrics();
        bars[j - gap].style.backgroundColor = 'red';
        await delay();
        
        array[j] = array[j - gap];
        bars[j].style.height = bars[j - gap].style.height;
        bars[j].setAttribute('data-value', array[j - gap]);
        
        bars[j].style.backgroundColor = 'steelblue';
        bars[j - gap].style.backgroundColor = 'steelblue';
      }
      
      array[j] = temp;
      bars[j].style.height = `${(temp / Math.max(...array)) * 90}%`;
      bars[j].setAttribute('data-value', temp);
      bars[i].style.backgroundColor = 'steelblue';
    }
  }
  
  for (let i = 0; i < n; i++) {
    bars[i].style.backgroundColor = 'green';
    await delay(50);
  }
}

// 8. Counting Sort (for integers)
async function countingSort() {
  let bars = document.querySelectorAll('.array-bar');
  let n = array.length;
  let max = Math.max(...array);
  let min = Math.min(...array);
  let range = max - min + 1;
  let count = new Array(range).fill(0);
  let output = new Array(n).fill(0);
  
  // Store count of each element
  for (let i = 0; i < n; i++) {
    count[array[i] - min]++;
    bars[i].style.backgroundColor = 'orange';
    await delay();
    bars[i].style.backgroundColor = 'steelblue';
  }
  
  // Change count[i] so it contains actual position
  for (let i = 1; i < count.length; i++) {
    count[i] += count[i - 1];
  }
  
  // Build the output array
  for (let i = n - 1; i >= 0; i--) {
    output[count[array[i] - min] - 1] = array[i];
    count[array[i] - min]--;
    bars[i].style.backgroundColor = 'red';
    await delay();
    bars[i].style.backgroundColor = 'steelblue';
  }
  
  // Copy the output array to original array
  for (let i = 0; i < n; i++) {
    array[i] = output[i];
    bars[i].style.height = `${(array[i] / max) * 90}%`;
    bars[i].setAttribute('data-value', array[i]);
    bars[i].style.backgroundColor = 'green';
    await delay(50);
  }
}

// 9. Radix Sort (for integers)
async function radixSort() {
  let max = Math.max(...array);
  let maxDigits = max.toString().length;
  
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    await countSortForRadix(exp);
  }
  
  const bars = document.querySelectorAll('.array-bar');
  for (let i = 0; i < array.length; i++) {
    bars[i].style.backgroundColor = 'green';
    await delay(50);
  }
}

async function countSortForRadix(exp) {
  let n = array.length;
  let output = new Array(n).fill(0);
  let count = new Array(10).fill(0);
  let bars = document.querySelectorAll('.array-bar');
  
  // Store count of occurrences
  for (let i = 0; i < n; i++) {
    let digit = Math.floor(array[i] / exp) % 10;
    count[digit]++;
    bars[i].style.backgroundColor = 'orange';
    await delay();
    bars[i].style.backgroundColor = 'steelblue';
  }
  
  // Change count[i] to actual position
  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }
  
  // Build the output array
  for (let i = n - 1; i >= 0; i--) {
    let digit = Math.floor(array[i] / exp) % 10;
    output[count[digit] - 1] = array[i];
    count[digit]--;
    bars[i].style.backgroundColor = 'red';
    await delay();
    bars[i].style.backgroundColor = 'steelblue';
  }
  
  // Copy the output array
  for (let i = 0; i < n; i++) {
    array[i] = output[i];
    bars[i].style.height = `${(array[i] / Math.max(...array)) * 90}%`;
    bars[i].setAttribute('data-value', array[i]);
    await delay(30);
  }
}

// 10. Bucket Sort
async function bucketSort() {
  let bars = document.querySelectorAll('.array-bar');
  let n = array.length;
  if (n <= 0) return;
  
  // Find min and max
  let min = Math.min(...array);
  let max = Math.max(...array);
  
  // Create buckets
  let bucketSize = 5;
  let bucketCount = Math.floor((max - min) / bucketSize) + 1;
  let buckets = new Array(bucketCount);
  
  for (let i = 0; i < bucketCount; i++) {
    buckets[i] = [];
  }
  
  // Distribute elements into buckets
  for (let i = 0; i < n; i++) {
    let bucketIdx = Math.floor((array[i] - min) / bucketSize);
    buckets[bucketIdx].push(array[i]);
    bars[i].style.backgroundColor = 'orange';
    await delay();
    bars[i].style.backgroundColor = 'steelblue';
  }
  
  // Sort individual buckets (using insertion sort)
  let index = 0;
  for (let i = 0; i < bucketCount; i++) {
    if (buckets[i].length > 0) {
      buckets[i].sort((a, b) => a - b);
      
      for (let j = 0; j < buckets[i].length; j++) {
        array[index] = buckets[i][j];
        bars[index].style.height = `${(array[index] / max) * 90}%`;
        bars[index].setAttribute('data-value', array[index]);
        bars[index].style.backgroundColor = 'green';
        index++;
        await delay(50);
      }
    }
  }
}

// 11. Bogo Sort (for demonstration only - very inefficient!)
async function bogoSort() {
  let bars = document.querySelectorAll('.array-bar');
  let n = array.length;
  
  while (!isSorted() && isSorting) {
    // Shuffle the array
    for (let i = n - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      await swap(i, j, bars);
      bars = document.querySelectorAll('.array-bar');
    }
    
    // Visualize current state
    for (let i = 0; i < n; i++) {
      bars[i].style.backgroundColor = 'red';
      await delay(10);
      bars[i].style.backgroundColor = 'steelblue';
    }
  }
  
  // Visualize sorted
  if (isSorting) {
    for (let i = 0; i < n; i++) {
      bars[i].style.backgroundColor = 'green';
      await delay(50);
    }
  }
}

function isSorted() {
  for (let i = 1; i < array.length; i++) {
    comparisons++;
    updatePerformanceMetrics();
    if (array[i - 1] > array[i]) {
      return false;
    }
  }
  return true;
}

// 12. Cocktail Shaker Sort
async function cocktailSort() {
  let bars = document.querySelectorAll('.array-bar');
  let n = array.length;
  let swapped = true;
  let start = 0;
  let end = n - 1;
  
  while (swapped) {
    swapped = false;
    
    // Left to right (like bubble sort)
    for (let i = start; i < end; i++) {
      comparisons++;
      updatePerformanceMetrics();
      bars[i].style.backgroundColor = 'red';
      bars[i + 1].style.backgroundColor = 'red';
      await delay();
      
      if (array[i] > array[i + 1]) {
        await swap(i, i + 1, bars);
        bars = document.querySelectorAll('.array-bar');
        swapped = true;
      }
      
      bars[i].style.backgroundColor = 'steelblue';
      bars[i + 1].style.backgroundColor = 'steelblue';
    }
    
    if (!swapped) break;
    
    swapped = false;
    end--;
    
    // Right to left
    for (let i = end - 1; i >= start; i--) {
      comparisons++;
      updatePerformanceMetrics();
      bars[i].style.backgroundColor = 'red';
      bars[i + 1].style.backgroundColor = 'red';
      await delay();
      
      if (array[i] > array[i + 1]) {
        await swap(i, i + 1, bars);
        bars = document.querySelectorAll('.array-bar');
        swapped = true;
      }
      
      bars[i].style.backgroundColor = 'steelblue';
      bars[i + 1].style.backgroundColor = 'steelblue';
    }
    
    start++;
  }
  
  for (let i = 0; i < n; i++) {
    bars[i].style.backgroundColor = 'green';
    await delay(50);
  }
}

// 13. Gnome Sort
async function gnomeSort() {
  let bars = document.querySelectorAll('.array-bar');
  let n = array.length;
  let index = 0;
  
  while (index < n) {
    if (index === 0) index++;
    
    comparisons++;
    updatePerformanceMetrics();
    bars[index].style.backgroundColor = 'red';
    bars[index - 1].style.backgroundColor = 'red';
    await delay();
    
    if (array[index] >= array[index - 1]) {
      bars[index].style.backgroundColor = 'steelblue';
      bars[index - 1].style.backgroundColor = 'steelblue';
      index++;
    } else {
      await swap(index, index - 1, bars);
      bars = document.querySelectorAll('.array-bar');
      index--;
    }
  }
  
  for (let i = 0; i < n; i++) {
    bars[i].style.backgroundColor = 'green';
    await delay(50);
  }
}

// 14. Comb Sort
async function combSort() {
  let bars = document.querySelectorAll('.array-bar');
  let n = array.length;
  let gap = n;
  let swapped = true;
  const shrink = 1.3;
  
  while (gap > 1 || swapped) {
    gap = Math.max(1, Math.floor(gap / shrink));
    swapped = false;
    
    for (let i = 0; i + gap < n; i++) {
      comparisons++;
      updatePerformanceMetrics();
      bars[i].style.backgroundColor = 'red';
      bars[i + gap].style.backgroundColor = 'red';
      await delay();
      
      if (array[i] > array[i + gap]) {
        await swap(i, i + gap, bars);
        bars = document.querySelectorAll('.array-bar');
        swapped = true;
      }
      
      bars[i].style.backgroundColor = 'steelblue';
      bars[i + gap].style.backgroundColor = 'steelblue';
    }
  }
  
  for (let i = 0; i < n; i++) {
    bars[i].style.backgroundColor = 'green';
    await delay(50);
  }
}

// 15. Cycle Sort
async function cycleSort() {
  let bars = document.querySelectorAll('.array-bar');
  let n = array.length;
  
  for (let cycleStart = 0; cycleStart < n - 1; cycleStart++) {
    let item = array[cycleStart];
    bars[cycleStart].style.backgroundColor = 'yellow';
    
    let pos = cycleStart;
    for (let i = cycleStart + 1; i < n; i++) {
      comparisons++;
      updatePerformanceMetrics();
      if (array[i] < item) pos++;
    }
    
    if (pos === cycleStart) {
      bars[cycleStart].style.backgroundColor = 'green';
      continue;
    }
    
    while (item === array[pos]) {
      pos++;
    }
    
    if (pos !== cycleStart) {
      [item, array[pos]] = [array[pos], item];
      bars[pos].style.height = `${(array[pos] / Math.max(...array)) * 90}%`;
      bars[pos].setAttribute('data-value', array[pos]);
      bars[pos].style.backgroundColor = 'red';
      await delay();
      bars[pos].style.backgroundColor = 'steelblue';
      swaps++;
      updatePerformanceMetrics();
    }
    
    while (pos !== cycleStart) {
      pos = cycleStart;
      for (let i = cycleStart + 1; i < n; i++) {
        comparisons++;
        updatePerformanceMetrics();
        if (array[i] < item) pos++;
      }
      
      while (item === array[pos]) {
        pos++;
      }
      
      if (item !== array[pos]) {
        [item, array[pos]] = [array[pos], item];
        bars[pos].style.height = `${(array[pos] / Math.max(...array)) * 90}%`;
        bars[pos].setAttribute('data-value', array[pos]);
        bars[pos].style.backgroundColor = 'red';
        await delay();
        bars[pos].style.backgroundColor = 'steelblue';
        swaps++;
        updatePerformanceMetrics();
      }
    }
    
    bars[cycleStart].style.backgroundColor = 'green';
  }
  
  bars[n - 1].style.backgroundColor = 'green';
}

// 16. Tim Sort (simplified implementation)
async function timSort() {
  const RUN = 32;
  let n = array.length;
  let bars = document.querySelectorAll('.array-bar');
  
  // Sort individual subarrays of size RUN
  for (let i = 0; i < n; i += RUN) {
    await insertionSortTim(i, Math.min(i + RUN - 1, n - 1));
  }
  
  // Start merging from size RUN
  for (let size = RUN; size < n; size = 2 * size) {
    for (let left = 0; left < n; left += 2 * size) {
      let mid = left + size - 1;
      let right = Math.min(left + 2 * size - 1, n - 1);
      
      if (mid < right) {
        await mergeTim(left, mid, right);
      }
    }
  }
  
  // Visualize completion
  for (let i = 0; i < n; i++) {
    bars[i].style.backgroundColor = 'green';
    await delay(50);
  }
}

async function insertionSortTim(left, right) {
  let bars = document.querySelectorAll('.array-bar');
  
  for (let i = left + 1; i <= right; i++) {
    let temp = array[i];
    let j = i - 1;
    bars[i].style.backgroundColor = 'yellow';
    
    while (j >= left && array[j] > temp) {
      comparisons++;
      updatePerformanceMetrics();
      bars[j].style.backgroundColor = 'red';
      await delay();
      
      array[j + 1] = array[j];
      bars[j + 1].style.height = bars[j].style.height;
      bars[j + 1].setAttribute('data-value', array[j]);
      
      bars[j].style.backgroundColor = 'steelblue';
      j--;
    }
    
    array[j + 1] = temp;
    bars[j + 1].style.height = `${(temp / Math.max(...array)) * 90}%`;
    bars[j + 1].setAttribute('data-value', temp);
    bars[i].style.backgroundColor = 'steelblue';
  }
}

async function mergeTim(l, m, r) {
  let bars = document.querySelectorAll('.array-bar');
  let len1 = m - l + 1;
  let len2 = r - m;
  
  // Create temp arrays
  let left = new Array(len1);
  let right = new Array(len2);
  
  // Copy data to temp arrays
  for (let x = 0; x < len1; x++) {
    left[x] = array[l + x];
    bars[l + x].style.backgroundColor = 'orange';
  }
  for (let x = 0; x < len2; x++) {
    right[x] = array[m + 1 + x];
    bars[m + 1 + x].style.backgroundColor = 'yellow';
  }
  
  await delay();
  
  // Merge temp arrays
  let i = 0, j = 0, k = l;
  
  while (i < len1 && j < len2) {
    comparisons++;
    updatePerformanceMetrics();
    bars[k].style.backgroundColor = 'red';
    await delay();
    
    if (left[i] <= right[j]) {
      array[k] = left[i];
      bars[k].style.height = `${(left[i] / Math.max(...array)) * 90}%`;
      i++;
    } else {
      array[k] = right[j];
      bars[k].style.height = `${(right[j] / Math.max(...array)) * 90}%`;
      j++;
    }
    
    bars[k].style.backgroundColor = 'steelblue';
    k++;
  }
  
  // Copy remaining elements
  while (i < len1) {
    array[k] = left[i];
    bars[k].style.height = `${(left[i] / Math.max(...array)) * 90}%`;
    bars[k].style.backgroundColor = 'steelblue';
    i++;
    k++;
    await delay();
  }
  
  while (j < len2) {
    array[k] = right[j];
    bars[k].style.height = `${(right[j] / Math.max(...array)) * 90}%`;
    bars[k].style.backgroundColor = 'steelblue';
    j++;
    k++;
    await delay();
  }
  
  // Visualize sorted section
  for (let x = l; x <= r; x++) {
    bars[x].style.backgroundColor = 'green';
    await delay(30);
  }
}

// Initialize on load
window.onload = function() {
  initArray();
};