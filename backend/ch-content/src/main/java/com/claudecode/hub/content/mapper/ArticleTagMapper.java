package com.claudecode.hub.content.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.claudecode.hub.content.entity.ArticleTag;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ArticleTagMapper extends BaseMapper<ArticleTag> {

    @Select("SELECT t.* FROM tag t JOIN article_tag at ON t.id = at.tag_id WHERE at.article_id = #{articleId}")
    List<com.claudecode.hub.content.entity.Tag> findTagsByArticleId(@Param("articleId") long articleId);
}
