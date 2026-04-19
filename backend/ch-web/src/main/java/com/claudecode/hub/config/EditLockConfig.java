package com.claudecode.hub.config;

import com.claudecode.hub.common.lock.EditLockService;
import com.claudecode.hub.common.lock.InMemoryEditLockService;
import com.claudecode.hub.common.lock.RedisEditLockService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.StringRedisTemplate;

@Configuration
public class EditLockConfig {

    @Bean
    @ConditionalOnProperty(name = "ch.editlock.backend", havingValue = "redis")
    public EditLockService redisEditLockService(StringRedisTemplate redis, ObjectMapper om) {
        return new RedisEditLockService(redis, om);
    }

    @Bean
    @ConditionalOnMissingBean(EditLockService.class)
    public EditLockService inMemoryEditLockService() {
        return new InMemoryEditLockService();
    }
}
