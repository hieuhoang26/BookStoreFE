const path = {
  home: '/',
  user: '/user',
  profile: '/user/profile',
  changePassword: '/user/password',
  historyPurchase: '/user/purchase',
  login: '/login',
  register: '/register',
  logout: '/logout',
  productDetail: ':nameId',
  cart: '/cart',
  order: '/order',
  shop: '/shop/:id',
  dashboard: '/manager/list',
  dashorder: '/manager/order'
} as const

export default path
