FROM ubuntu
RUN apt-get update -y && apt-get install -y ca-certificates curl gnupg && \
    echo "deb https://deb.nodesource.com/node_8.x bionic main" >> /etc/apt/sources.list.d/nodesource.list && \
    echo "deb-src https://deb.nodesource.com/node_8.x bionic main" >> /etc/apt/sources.list.d/nodesource.list && \
    curl -s https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add -
RUN apt-get update -y && apt-get install -y p7zip-full clang-format python-pygments nodejs gcc g++ make libboost-filesystem-dev git
RUN mkdir /opt/syzoj && mkdir /opt/judge-v3
ADD syzoj/package.json /opt/syzoj
ADD judge-v3/package.json /opt/judge-v3
RUN cd /opt/syzoj && npm install && cd /opt/judge-v3 && npm install
ADD syzoj /opt/syzoj
ADD judge-v3 /opt/judge-v3
WORKDIR /opt/syzoj
RUN node_modules/.bin/tsc || true
WORKDIR /opt/judge-v3
RUN node_modules/.bin/tsc || true
WORKDIR /
