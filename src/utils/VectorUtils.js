export const Vec3 = {
  add: (v, u) => ({
      x: v.x + u.x,
      y: v.y + u.y,
      z: v.z + u.z
  }),
  scale: (v, a) => ({
      x: a*v.x,
      y: a*v.y,
      z: a*v.z
  }),
  destructure: (v) => ({
      x: v.x,
      y: v.y,
      z: v.z
  })
};
