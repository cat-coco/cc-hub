package com.claudecode.hub.interaction.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.claudecode.hub.interaction.entity.Comment;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CommentMapper extends BaseMapper<Comment> {
}
