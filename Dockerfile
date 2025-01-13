# Use the Grafana k6 image as the base image
FROM grafana/k6

# Switch to root user temporarily to perform mv command
USER root

# Download and install InfluxDB from binary
RUN wget -O /tmp/influxdb.tar.gz https://dl.influxdata.com/influxdb/releases/influxdb-1.8.9_linux_amd64.tar.gz && \
    tar -C /tmp -xzf /tmp/influxdb.tar.gz && \
    mv /tmp/influxdb-* /opt/influxdb && \
    rm /tmp/influxdb.tar.gz

# Switch back to non-root user for security
USER k6

# Set environment variables
ENV INFLUXDB_CONFIG_PATH /etc/influxdb/influxdb.conf
ENV INFLUXDB_DATA_PATH /var/lib/influxdb
ENV PATH="/opt/influxdb:${PATH}"

# Set the working directory
WORKDIR /usr/src/app

# Copy your k6 test script to the container
COPY . .

# Expose port 8086 for InfluxDB
EXPOSE 8086

# Switch to root user temporarily to perform mv command
USER root

# Run the k6 test and push results to InfluxDB
RUN k6 run --out influxdb=http://influxdb:8086/mydb run.test.js
# CMD ["k6", "run", "--out", "influxdb=http://influxdb:8086/mydb", "run.test.js"]