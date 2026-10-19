import re

file_path = "src/app/(public)/page.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Replace MR Zombie Shooter image to video
content = content.replace(
    '{ type: "project", title: "MR Zombie Shooter", tag: "MR Game", description: "A mixed reality survival shooter leveraging Meta Quest 3 spatial mapping and passthrough.", link: "#", mediaUrl: "/images/insta360.jpg", mediaType: "image" }',
    '{ type: "project", title: "MR Zombie Shooter", tag: "MR Game", description: "A mixed reality survival shooter leveraging Meta Quest 3 spatial mapping and passthrough.", link: "#", mediaUrl: "/videos/MR_Game.mp4", mediaType: "video" }'
)

# Replace Medieval Market with Echoes of Reality
content = content.replace(
    '{ type: "project", title: "Medieval Market", tag: "Android Simulation", description: "A mobile market simulation set in a vibrant medieval world — trade, build, and prosper.", link: "https://raghul-gem.itch.io/medival-market-simdemo", mediaUrl: "/videos/market_sim.mp4", mediaType: "video" }',
    '{ type: "project", title: "Echoes of Reality", tag: "Android Mobile", description: "An immersive mobile experience exploring the echoes of reality.", link: "#", mediaUrl: "/videos/MobileGame.mp4", mediaType: "video" }'
)

with open(file_path, "w") as f:
    f.write(content)
