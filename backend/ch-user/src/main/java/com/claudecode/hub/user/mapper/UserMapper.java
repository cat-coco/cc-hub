package com.claudecode.hub.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.claudecode.hub.user.entity.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<User> {
}
