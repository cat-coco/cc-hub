package com.claudecode.hub;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = "com.claudecode.hub")
@MapperScan(basePackages = "com.claudecode.hub.**.mapper")
@EnableScheduling
@EnableAsync
public class ChHubApplication {
    public static void main(String[] args) {
        SpringApplication.run(ChHubApplication.class, args);
    }
}
