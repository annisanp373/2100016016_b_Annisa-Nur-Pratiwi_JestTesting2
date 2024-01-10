// ! Dont change this code
const {
  fetchProductsData,
  setProductsCards,
  convertToRupiah,
  countDiscount,
} = require("../src/index.js");
const cartData = require("../src/data/cart.js");

// @ Write your code here

// Asyncronous Testing
// https://jestjs.io/docs/asynchronous

  // Test Case 1
describe('Product API Testing', () => {
  test('should return product data with id 1', async () => {
    const productData = await fetchProductsData(1);
    expect(productData.id).toBe(1);
    expect(productData.title).toBe("iPhone 9");
  });

  // Test Case 2
  test('should check products.length with limit', async () => {
    const allProducts = await fetchProductsData();
    expect(allProducts).toBeDefined();
    expect(allProducts).not.toBeNull();
    expect(typeof allProducts).toBe('object');
  });

  // Test Case 3
  test("should validate product discount calculation", () => {
    const price = 100;
    const discountPercentage = 10;
    const discountedPrice = countDiscount(price, discountPercentage);
    expect(discountedPrice).toBe(90);
  });
});


// Mocking
// https://jestjs.io/docs/mock-functions

const { fetchCartsData } = require("../src/dataService");

jest.mock("../src/dataservice", () => {
  const originalModule = jest.requireActual("../src/dataservice");
  return {
    ...originalModule,
    __esModule: true,
    fetchCartsData: jest.fn(),
  };
});

  //Test Case 1
  describe("Cart API Testing", () => {
      test("should compare total cart items with length of fetched data", async () => {
      fetchCartsData.mockResolvedValue(cartData.carts);
      const cartsData = await fetchCartsData();
      const totalItems = cartsData.length;
      const expectedTotal = cartData.total;
      expect(totalItems).toBe(expectedTotal);
    });
  
    // Test case 2
      test("should compare total length of carts data with total", async () => {
      fetchCartsData.mockResolvedValue([
        { id: 1, productId: 1, quantity: 1 },
        { id: 2, productId: 2, quantity: 2 },
      ]);
      const cartsData = await fetchCartsData();
      const totalLength = cartsData.reduce((acc, cart) => acc + cart.quantity, 0);
      expect(totalLength).toBe(3);
    });
  });
  
  let productsData;

  // Fetch data produk sebelum menjalankan test suite
beforeAll(async () => {
  productsData = await fetchProductsData();
});

describe("Product Utility Testing", () => {
  describe("convertToRupiah", () => {
    // Test case 1
    test("should convert 100 dollars into rupiah", () => {
      const priceInRupiah = convertToRupiah(100);
      expect(priceInRupiah).toMatch(/Rp\s1\.543\.600,\d{2}/);
      expect(typeof priceInRupiah).toBe("string");
    });

    // Test case 2
    test("should convert 1000 dollars into rupiah", () => {
      const priceInRupiah = convertToRupiah(1000);
      expect(priceInRupiah).toMatch(/Rp\s15\.436\.000,\d{2}/);
    });
  });

  test("should calculate discount correctly", () => {
    // Test case 1 menguji fungsi countDiscount dengan keadaan awal harganya sebesar 100.000 dan diskon sebesar 20%
    const discountedPrice1 = countDiscount(100000, 20);
    expect(discountedPrice1).toBe(80000);

    // Test case 2, menguji fungsi countDiscount yaitu memastikan harga diskon telah dihitung dengan benar 
    const discountedPrice2 = countDiscount(75000, 10);
    expect(discountedPrice2).toBe(67500);
  });

  describe("setProductsCards", () => {
    test("it should return an array of products with specific keys", () => {
      const productsCards = setProductsCards(productsData.products);
      const firstProductKeys = Object.keys(productsCards[0]);
      const expectedKeys = ["price", "after_discount", "image"];
      expect(firstProductKeys).toEqual(expect.arrayContaining(expectedKeys));
    });
  });
});
