
/**
 * Element 代表元素
 * Text 代表元素或属性中的文本内容
 * Comment 代表注释
 * Document 代表整个文档（DOM 树的根节点）
 * DocumentFragmen 代表轻量级的 Document 对象，能够容纳文档的某个部分
 */
export const ELEMENT_NODE = 1;
export const TEXT_NODE = 3;
export const COMMENT_NODE = 8;
export const DOCUMENT_NODE = 9;
export const DOCUMENT_FRAGMENT_NODE = 11;