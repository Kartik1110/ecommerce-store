export const title = {
  adminRoutes: {
    desc: 'Admin routes',
    itShouldGenerateDiscount: 'it should generate discount codes for correct input',
    itShouldHandleError: 'it should give status code 500 for internal error',
    itShouldHandleValidation: 'it should give status code 400 for incorrect input',
  },
  userRoutes: {
    desc: 'User routes',
    itShouldGetAllItems: 'it should get all items if items are present',
    itShouldHandleItemNotFound: 'it should return 404 if items are not present',
    itShouldHandleError: 'it should give status code 500 for internal error',
    itShouldHandleValidation: 'it should give status code 400 for incorrect input',
    itShouldAddCartIfNotExists: 'it should add items to cart if cart does not exist',
    itShouldAddCartIfExists: 'it should add items to cart if cart already exists',
    itShouldCheckoutCart: 'it should checkout cart if item exists',
    itShouldHandleErrorCheckout: 'it should checkout cart if item does not exists',
    itShouldHandleInvalidDiscount: 'it should handle invalid discount if user is not eligible',
  },
};
