# Multi-stage build for RisingLion Game
FROM nginx:alpine

# Copy game files to nginx html directory
COPY index.html /usr/share/nginx/html/
COPY game.js /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY images/ /usr/share/nginx/html/images/
COPY sounds/ /usr/share/nginx/html/sounds/

# Fix permissions for images and sounds
RUN chmod -R 644 /usr/share/nginx/html/images/* || true
RUN chmod -R 644 /usr/share/nginx/html/sounds/* || true
RUN chmod -R 755 /usr/share/nginx/html/images/ /usr/share/nginx/html/sounds/

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]