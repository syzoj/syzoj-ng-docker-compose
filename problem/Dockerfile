FROM ubuntu:18.04
RUN sed -i s/archive.ubuntu.com/mirrors.aliyun.com/g /etc/apt/sources.list
ADD mysql.gpg /etc/apt/trusted.gpg.d/mysql.gpg
RUN echo "deb http://repo.mysql.com/apt/ubuntu/ bionic mysql-8.0" > /etc/apt/sources.list.d/mysql.list; \
    apt-get update -y; \
    apt-get install -y mysql-community-client
RUN mkdir /data
ADD problem /
CMD ["/problem"]
