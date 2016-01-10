RACK stands for Robotics Automation and Control Kickoff,
it's a physics simulation running on react-three-renderer and redux,
the aim is to allow engineers to play with a higher level of abstraction in control algorithms.

============================

With Cannon.js and Oimo.js support. (you can check it out in the workers folder, on CannonCmd and OimoCmd files)
NOTE: Support to constraints/joints is WIP and Cannon has no direct support for Wheel constraints, as Oimo does.
However, Cannon has directly support for a steering vehicle which is currently WIP.

Also, for some reason Oimo it's letting some objects pass right through if you add around 20+ (yikes!)

============================

TODO: Check support for relative positioning in both Cannon and Oimo. They should both receive nested relative data and return in the same way.
Maybe looking at how Unity deals with Transforms will give me an insight
That's my idea: each worker will receive the relative view on the loop, flat but nested by the keys.
The first thing each worker does is to switch every object it receives into his local coordinates.
(that essentially binds Worker with Body) perhaps OimoBody should be made to look more like OimoJoint, and Body should be made a hoc

============================

I still think there is space for optimization on the render happening after each dispatch
