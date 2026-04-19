package com.claudecode.hub.content.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.claudecode.hub.content.entity.Snippet;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface SnippetMapper extends BaseMapper<Snippet> {
    @Update("UPDATE snippet SET copy_count = copy_count + 1 WHERE id = #{id}")
    int incrCopy(@Param("id") long id);
}
