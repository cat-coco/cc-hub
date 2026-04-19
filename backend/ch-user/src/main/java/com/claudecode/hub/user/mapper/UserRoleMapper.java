package com.claudecode.hub.user.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface UserRoleMapper {

    @Select("SELECT r.code FROM role r JOIN user_role ur ON r.id = ur.role_id WHERE ur.user_id = #{userId}")
    List<String> findRoleCodesByUserId(@Param("userId") long userId);

    @org.apache.ibatis.annotations.Insert("INSERT IGNORE INTO user_role (user_id, role_id) " +
            "SELECT #{userId}, id FROM role WHERE code = #{roleCode}")
    int assignRole(@Param("userId") long userId, @Param("roleCode") String roleCode);
}
