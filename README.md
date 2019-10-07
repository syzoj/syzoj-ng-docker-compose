syzoj-ng
---

syzoj-ng 项目的主 repo。目前正在进行过渡的策略，在原有的 syzoj 和 judge-v3 的基础上进行小幅修改，用 Go 语言逐渐重新实现原有的所有功能。

安装方法：
1. 进入 `deploy` 文件夹，运行 `prepare.sh`，自动生成配置文件里需要的各种密钥。
2. 创建一个新文件夹，复制 `docker-compose.yml` 和 `config` 文件夹，并创建一个名为 `sandbox-rootfs` 的空文件夹。
3. 执行 `docker pull syzoj/rootfs:181202`，`docker create --name rootfs syzoj/rootfs:181202`，`docker export rootfs | sudo tar xvf - -C sandbox-rootfs`，安装 sandbox-rootfs.
4. 运行 `docker-compose up -d`，搭建所有容器。
5. 导入 repo 根目录下的 `init.sql` 到 `mysql` 容器中。命令是 `docker exec -i <mysql_container_name> mysql -uroot -p123456 syzoj < init.sql`，其中 `mysql_container_name` 可以通过 `docker ps -a` 找到。
6. 再次运行 `docker-compose up -d`，启动未启动的容器，注意部分出错的容器可能需要重启。
