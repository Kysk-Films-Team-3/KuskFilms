package com.kyskfilms.share.dto

data class ShareDataDto(
    val contentTitle: String, val shareUrl: String, val shareMessage: String,
    val socialLinks: SocialLinksDto, val ui: ShareUiLabelsDto
)
data class SocialLinksDto(val telegram: String, val twitter: String, val facebook: String)
data class ShareUiLabelsDto(
    val modalTitle: String, val copyButton: String, val copiedState: String,
    val shareToLabel: String, val telegramLabel: String, val twitterLabel: String, val facebookLabel: String
)